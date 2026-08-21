import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizePartnerCode, findUserByPartnerCode, ensureMutualPair, makePartnerCode } from '../common/pair';
import { COUPLE_QUESTIONS, questionOfTheDay } from './couple-questions';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, startDate: string, partnerName: string) {
    const existing = await this.prisma.relationship.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Zaten bir ilişki kaydınız var');

    const r = await this.prisma.relationship.create({
      data: { userId, startDate: new Date(startDate), partnerName },
    });
    return this.format(r);
  }

  async get(userId: string) {
    let r = await this.prisma.relationship.findUnique({ where: { userId } });
    if (!r) {
      // Check if user is paired and partner has relationship data
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.pairedUserId) {
        const partnerRel = await this.prisma.relationship.findUnique({ where: { userId: user.pairedUserId } });
        if (partnerRel) {
          // Auto create synced relationship for this user
          r = await this.prisma.relationship.create({
            data: {
              userId,
              startDate: partnerRel.startDate,
              partnerName: (await this.prisma.user.findUnique({ where: { id: user.pairedUserId } }))?.name || partnerRel.partnerName,
            },
          });
        }
      }
    }
    if (!r) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { pairedUserId: true } });
      const partnerName = user?.pairedUserId
        ? (await this.prisma.user.findUnique({ where: { id: user.pairedUserId }, select: { name: true } }))?.name
        : '';
      return {
        id: '',
        startDate: new Date(),
        partnerName: partnerName || '',
        daysTogether: 0,
        createdAt: new Date(),
      };
    }
    return this.format(r);
  }

  async update(userId: string, id: string, data: { startDate?: string; partnerName?: string }) {
    const existing = await this.prisma.relationship.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('İlişki kaydı bulunamadı');

    const r = await this.prisma.relationship.update({
      where: { userId },
      data: {
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.partnerName && { partnerName: data.partnerName }),
      },
    });

    // If user is paired, sync start date with partner
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.pairedUserId && data.startDate) {
      await this.prisma.relationship.updateMany({
        where: { userId: user.pairedUserId },
        data: { startDate: new Date(data.startDate) },
      }).catch(() => {});
    }

    return this.format(r);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.relationship.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException('İlişki kaydı bulunamadı');
    await this.prisma.relationship.delete({ where: { userId } });
    return { success: true };
  }

  async getPartnerInfo(userId: string) {
    let user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    if (!user.partnerCode) {
      user = await this.prisma.user.update({
        where: { id: userId },
        data: { partnerCode: makePartnerCode() },
      });
    }

    const linked = await ensureMutualPair(this.prisma, userId);
    return {
      partnerCode: linked.user?.partnerCode || user.partnerCode,
      isPaired: linked.isPaired,
      paired: linked.isPaired,
      pairedUserName: linked.partner?.nickname || linked.partner?.name,
      partnerName: linked.partner?.nickname || linked.partner?.name,
      pairedUserEmail: linked.partner?.email,
      pairedUserId: linked.partnerId,
      myGender: user.gender ?? null,
      partnerGender: linked.partner?.gender ?? null,
    };
  }

  async lookupPartner(userId: string, partnerCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true, partnerCode: true, pairedUserId: true },
    });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    if (!user.gender) {
      throw new BadRequestException('Eşleşmeden önce profilinizde cinsiyetinizi kaydedin.');
    }

    const myCodes = normalizePartnerCode(user.partnerCode || '');
    const variants = normalizePartnerCode(partnerCode);
    if (variants.some((v) => myCodes.includes(v))) {
      throw new BadRequestException('Kendi partner kodunuzu giremezsiniz');
    }

    const partner = await findUserByPartnerCode(this.prisma, partnerCode);
    if (!partner) {
      throw new NotFoundException('Geçersiz partner kodu. Kodun tam olarak partnerinizin ekranındaki gibi olduğundan emin olun.');
    }
    if (partner.pairedUserId && partner.pairedUserId !== userId) {
      throw new ConflictException('Bu partner kodu başka bir hesapla eşleşmiş');
    }

    return {
      name: partner.nickname || partner.name,
      gender: partner.gender,
      alreadyPaired: false,
      sameGender: !!user.gender && !!partner.gender && user.gender === partner.gender && user.gender !== 'other',
    };
  }

  async pairPartner(userId: string, partnerCode: string) {
    const variants = normalizePartnerCode(partnerCode);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    if (!user.gender) {
      throw new BadRequestException('Eşleşmeden önce profilinizde cinsiyetinizi kaydedin.');
    }

    const myCodes = normalizePartnerCode(user.partnerCode || '');
    if (variants.some((v) => myCodes.includes(v))) {
      throw new BadRequestException('Kendi partner kodunuzu giremezsiniz');
    }

    const partner = await findUserByPartnerCode(this.prisma, partnerCode);
    if (!partner) {
      throw new NotFoundException('Geçersiz partner kodu. Kodun tam olarak partnerinizin ekranındaki gibi olduğundan emin olun (ör. BL-9X2K4A).');
    }

    if (user.pairedUserId && user.pairedUserId !== partner.id) {
      throw new ConflictException('Zaten başka bir hesapla eşleştiniz. Önce mevcut bağlantıyı kesin.');
    }
    if (partner.pairedUserId && partner.pairedUserId !== userId) {
      throw new ConflictException('Bu partner kodu başka bir hesapla eşleşmiş');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { pairedUserId: partner.id },
    });
    await this.prisma.user.update({
      where: { id: partner.id },
      data: { pairedUserId: userId },
    });

    const myRel = await this.prisma.relationship.findUnique({ where: { userId } });
    const partnerRel = await this.prisma.relationship.findUnique({ where: { userId: partner.id } });

    if (partnerRel && !myRel) {
      await this.prisma.relationship.create({
        data: { userId, startDate: partnerRel.startDate, partnerName: partner.name },
      });
    } else if (myRel && !partnerRel) {
      await this.prisma.relationship.create({
        data: { userId: partner.id, startDate: myRel.startDate, partnerName: user.name },
      });
    } else if (!myRel && !partnerRel) {
      const start = new Date();
      await this.prisma.relationship.create({
        data: { userId, startDate: start, partnerName: partner.name },
      });
      await this.prisma.relationship.create({
        data: { userId: partner.id, startDate: start, partnerName: user.name },
      });
    } else if (myRel && partnerRel && myRel.startDate.getTime() !== partnerRel.startDate.getTime()) {
      const earlier = myRel.startDate < partnerRel.startDate ? myRel.startDate : partnerRel.startDate;
      await this.prisma.relationship.updateMany({
        where: { userId: { in: [userId, partner.id] } },
        data: { startDate: earlier },
      });
    }

    if (user.pairedUserId !== partner.id) {
      await this.prisma.notification.create({
        data: {
          userId: partner.id,
          type: 'partner_paired',
          module: 'relationship',
          title: 'Partneriniz eşleşti',
          body: `${user.nickname || user.name} sizinle Pusena’da eşleşti. Çift soruları, özel günler ve anılar artık ortak.`,
        },
      });
    }

    return {
      success: true,
      partnerCode: user.partnerCode,
      isPaired: true,
      paired: true,
      pairedUserName: partner.nickname || partner.name,
      partnerName: partner.nickname || partner.name,
      pairedUserEmail: partner.email,
      pairedUserId: partner.id,
      myGender: user.gender ?? null,
      partnerGender: partner.gender ?? null,
    };
  }

  async unpair(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { pairedUserId: true } });
    if (user?.pairedUserId) {
      await this.prisma.user.updateMany({
        where: { id: { in: [userId, user.pairedUserId] } },
        data: { pairedUserId: null },
      });
    } else {
      await this.prisma.user.update({ where: { id: userId }, data: { pairedUserId: null } });
    }
    return this.getPartnerInfo(userId);
  }

  async getCoupleQuestions(userId: string) {
    const linked = await ensureMutualPair(this.prisma, userId);
    const partnerId = linked.partnerId;
    const partnerName = linked.partner?.nickname || linked.partner?.name || null;

    const myAnswers = await this.prisma.coupleQuestionAnswer.findMany({ where: { userId } });
    const myMap = new Map(myAnswers.map((a) => [a.questionId, a.answer]));

    let partnerMap = new Map<string, string>();
    if (partnerId) {
      const partnerAnswers = await this.prisma.coupleQuestionAnswer.findMany({ where: { userId: partnerId } });
      partnerMap = new Map(partnerAnswers.map((a) => [a.questionId, a.answer]));
    }

    const decorate = (q: { id: string; category: string; question: string }) => {
      const myAnswer = myMap.get(q.id) ?? null;
      const partnerRaw = partnerMap.get(q.id) ?? null;
      const revealed = !!(myAnswer && partnerRaw);
      return {
        ...q,
        myAnswer,
        partnerAnswer: revealed ? partnerRaw : null,
        partnerHasAnswered: !!partnerRaw,
        revealed,
      };
    };

    const items = COUPLE_QUESTIONS.map(decorate);
    const today = decorate(questionOfTheDay());

    return {
      items,
      today,
      total: COUPLE_QUESTIONS.length,
      isPaired: !!partnerId,
      partnerName,
    };
  }

  async saveCoupleAnswer(userId: string, questionId: string, answer: string) {
    const q = COUPLE_QUESTIONS.find((item) => item.id === questionId);
    if (!q) throw new NotFoundException('Soru bulunamadı');
    const text = answer.trim();
    if (!text) throw new BadRequestException('Cevap boş olamaz');

    const row = await this.prisma.coupleQuestionAnswer.upsert({
      where: { userId_questionId: { userId, questionId } },
      update: { answer: text },
      create: { userId, questionId, answer: text },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pairedUserId: true, nickname: true, name: true },
    });
    if (user?.pairedUserId) {
      const partnerAnswer = await this.prisma.coupleQuestionAnswer.findUnique({
        where: { userId_questionId: { userId: user.pairedUserId, questionId } },
      });
      await this.prisma.notification.create({
        data: {
          userId: user.pairedUserId,
          type: 'couple_question',
          module: 'relationship',
          title: partnerAnswer ? 'Çift sorusu açıldı' : 'Partnerin cevap verdi',
          body: partnerAnswer
            ? `${user.nickname || user.name} da cevapladı. “${q.question}” kilidi açıldı.`
            : `${user.nickname || user.name} çift sorusuna cevap yazdı.`,
          referenceId: questionId,
        },
      }).catch(() => {});
    }

    return this.getCoupleQuestions(userId).then((pack) => ({
      saved: row,
      question: pack.items.find((i) => i.id === questionId),
      today: pack.today,
      isPaired: pack.isPaired,
      partnerName: pack.partnerName,
    }));
  }

  private format(r: any) {
    const daysTogether = Math.floor((Date.now() - new Date(r.startDate).getTime()) / (24 * 60 * 60 * 1000));
    return { id: r.id, startDate: r.startDate, partnerName: r.partnerName, daysTogether, createdAt: r.createdAt };
  }
}
