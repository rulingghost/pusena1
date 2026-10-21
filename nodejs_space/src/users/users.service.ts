import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, SaveAssessmentDto, UpsertMemoryDto } from './dto/users.dto';
import { getPairUserIds } from '../common/pair';
import { MediaService } from '../media/media.service';
import { calculatePregnancyProgress } from '../common/dates';

const MAX_MEMORY_IMAGES = 2;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.nickname !== undefined) data.nickname = dto.nickname || null;
    if (dto.biography !== undefined) data.biography = dto.biography || null;
    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = await this.media.persistDataUri(userId, 'avatar', dto.avatarUrl);
    }
    if (dto.gender !== undefined) data.gender = dto.gender || null;
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.birthYear !== undefined) data.birthYear = dto.birthYear;
    if (dto.heightCm !== undefined) data.heightCm = dto.heightCm;
    if (dto.weightKg !== undefined) data.weightKg = dto.weightKg;

    const user = await this.prisma.user.update({ where: { id: userId }, data });
    return {
      id: user.id, email: user.email, name: user.name, nickname: user.nickname,
      biography: user.biography, avatarUrl: user.avatarUrl,
      gender: user.gender, language: user.language, birthYear: user.birthYear,
      heightCm: user.heightCm, weightKg: user.weightKg,
      createdAt: user.createdAt,
    };
  }

  async setLanguage(userId: string, language: string) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { language } });
    return { language: user.language };
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');
    return { id: user.id, name: user.name, nickname: user.nickname, avatarUrl: user.avatarUrl, createdAt: user.createdAt };
  }

  // ---------- Fertility assessment ----------

  private computeAssessment(a: {
    goal?: string | null;
    tryingDuration?: string | null;
    cycleRegularity?: string | null;
    healthConditions?: string[];
    heightCm?: number | null;
    weightKg?: number | null;
    age?: number | null;
  }) {
    let score = 100;
    const insights: string[] = [];
    const recommendations: string[] = [];

    let bmi: number | null = null;
    if (a.heightCm && a.weightKg && a.heightCm > 0) {
      const m = a.heightCm / 100;
      bmi = Math.round((a.weightKg / (m * m)) * 10) / 10;

      if (bmi < 18.5) {
        score -= 12;
        insights.push(`Vücut kitle indeksiniz ${bmi} (zayıf). Düşük BKİ yumurtlamayı düzensizleştirebilir.`);
        recommendations.push('Kalori ve sağlıklı yağ alımınızı artırmak için bir diyetisyene danışın.');
      } else if (bmi >= 25 && bmi < 30) {
        score -= 8;
        insights.push(`Vücut kitle indeksiniz ${bmi} (fazla kilolu). %5-10 kilo kaybı bile döngü düzenini iyileştirebilir.`);
        recommendations.push('Haftada 150 dakika orta tempolu egzersiz hedefleyin.');
      } else if (bmi >= 30) {
        score -= 16;
        insights.push(`Vücut kitle indeksiniz ${bmi} (obez). İnsülin direnci yumurtlamayı etkileyebilir.`);
        recommendations.push('Beslenme ve hormon paneli için hekiminize başvurun.');
      } else {
        insights.push(`Vücut kitle indeksiniz ${bmi} — doğurganlık için ideal aralıkta.`);
      }
    }

    if (a.age) {
      if (a.age >= 40) {
        score -= 20;
        insights.push('40 yaş üzerinde yumurta rezervi ve kalitesi belirgin azalır; değerlendirme süresi kısaltılmalıdır.');
        recommendations.push('6 aydan uzun süredir deniyorsanız üreme sağlığı uzmanına başvurun.');
      } else if (a.age >= 35) {
        score -= 10;
        insights.push('35 yaş sonrası doğurganlık kademeli azalır; 6 ay içinde sonuç alınamazsa değerlendirme önerilir.');
      } else if (a.age <= 20) {
        insights.push('Yaşınız doğurganlık açısından en verimli aralıkta.');
      }
    }

    if (a.cycleRegularity === 'irregular') {
      score -= 15;
      insights.push('Düzensiz döngüler yumurtlamanın her ay gerçekleşmediğine işaret edebilir.');
      recommendations.push('Hormon paneli (AMH, TSH, prolaktin) ve ultrason kontrolü yaptırın.');
    } else if (a.cycleRegularity === 'regular') {
      insights.push('Düzenli döngüleriniz büyük olasılıkla düzenli yumurtladığınızı gösterir.');
    }

    if (a.tryingDuration === '12plus') {
      score -= 18;
      insights.push('12 aydan uzun süredir deniyorsanız tıbbi değerlendirme önerilir (infertilite tanımı).');
      recommendations.push('Siz ve partneriniz için temel infertilite testlerini planlayın.');
    } else if (a.tryingDuration === '6-12') {
      score -= 6;
      insights.push('6-12 aylık deneme süresi normal aralıkta; çiftlerin çoğu 12 ay içinde gebe kalır.');
    }

    const conditions = a.healthConditions ?? [];
    if (conditions.includes('pcos')) {
      score -= 14;
      insights.push('PCOS yumurtlama düzensizliğine yol açabilir; inositol ve insülin direnci yönetimi etkilidir.');
      recommendations.push('PCOS için düşük glisemik indeksli beslenme ve düzenli hareket planlayın.');
    }
    if (conditions.includes('endometriosis')) {
      score -= 14;
      insights.push('Endometriozis tüplerde ve yumurtalıklarda yapışıklığa neden olabilir.');
      recommendations.push('Ağrı yönetimi ve gebelik planı için jinekoloğunuzla görüşün.');
    }
    if (conditions.includes('thyroid')) {
      score -= 8;
      insights.push('Tiroid fonksiyon bozuklukları döngüyü ve implantasyonu etkileyebilir.');
      recommendations.push('TSH değerinizi 0.5-2.5 aralığında tutmak için tedavinizi takip edin.');
    }

    if (a.goal === 'ttc') {
      recommendations.push('Günlük 400 mcg folik asit almaya bugün başlayın.');
      recommendations.push('Doğurganlık pencerenizde gün aşırı ilişki gebe kalma şansını en üst düzeye çıkarır.');
    } else if (a.goal === 'natural') {
      recommendations.push('Bazal vücut sıcaklığı ve servikal mukus takibini birlikte yapın; tek başına takvim yöntemi güvenilir değildir.');
    } else {
      recommendations.push('Semptom ve döngü kaydını düzenli tutmak kişisel tahminlerinizin doğruluğunu artırır.');
    }

    score = Math.max(20, Math.min(100, score));
    return { score, bmi, insights, recommendations };
  }

  async saveAssessment(userId: string, dto: SaveAssessmentDto) {
    const computed = this.computeAssessment({
      goal: dto.goal,
      tryingDuration: dto.tryingDuration,
      cycleRegularity: dto.cycleRegularity,
      healthConditions: dto.healthConditions,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      age: dto.age,
    });

    const payload = {
      goal: dto.goal ?? null,
      tryingDuration: dto.tryingDuration ?? null,
      cycleRegularity: dto.cycleRegularity ?? null,
      contraceptionPast: dto.contraceptionPast ?? null,
      healthConditions: dto.healthConditions ?? [],
      heightCm: dto.heightCm ?? null,
      weightKg: dto.weightKg ?? null,
      age: dto.age ?? null,
      answers: (dto.answers ?? {}) as any,
      score: computed.score,
    };

    await this.prisma.fertilityAssessment.upsert({
      where: { userId },
      update: payload,
      create: { userId, ...payload },
    });

    if (dto.heightCm || dto.weightKg) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.heightCm ? { heightCm: dto.heightCm } : {}),
          ...(dto.weightKg ? { weightKg: dto.weightKg } : {}),
        },
      });
    }

    return { ...payload, ...computed };
  }

  async getAssessment(userId: string) {
    const a = await this.prisma.fertilityAssessment.findUnique({ where: { userId } });
    if (!a) return null;
    const computed = this.computeAssessment({
      goal: a.goal,
      tryingDuration: a.tryingDuration,
      cycleRegularity: a.cycleRegularity,
      healthConditions: a.healthConditions,
      heightCm: a.heightCm,
      weightKg: a.weightKg,
      age: a.age,
    });
    return {
      goal: a.goal, tryingDuration: a.tryingDuration, cycleRegularity: a.cycleRegularity,
      contraceptionPast: a.contraceptionPast, healthConditions: a.healthConditions,
      heightCm: a.heightCm, weightKg: a.weightKg, age: a.age,
      ...computed,
    };
  }

  // ---------- Couple memories ----------

  async getMemories(userId: string) {
    const ids = await getPairUserIds(this.prisma, userId);
    const items = await this.prisma.coupleMemory.findMany({
      where: { userId: { in: ids } },
      orderBy: { date: 'desc' },
    });
    return {
      items: items.map((m) => ({ ...m, mine: m.userId === userId })),
      total: items.length,
    };
  }

  async createMemory(userId: string, dto: UpsertMemoryDto) {
    const imageUrls = await this.media.persistMany(userId, 'memory', (dto.imageUrls ?? []).slice(0, MAX_MEMORY_IMAGES));
    if ((dto.imageUrls?.length ?? 0) > MAX_MEMORY_IMAGES) {
      throw new BadRequestException(`Bir anıya en fazla ${MAX_MEMORY_IMAGES} fotoğraf ekleyebilirsiniz`);
    }
    return this.prisma.coupleMemory.create({
      data: {
        userId,
        title: dto.title,
        date: new Date(dto.date),
        category: dto.category || 'Anı',
        emoji: dto.emoji || '✨',
        notes: dto.notes || null,
        imageUrls,
      },
    });
  }

  async updateMemory(userId: string, memoryId: string, dto: UpsertMemoryDto) {
    const existing = await this.prisma.coupleMemory.findFirst({ where: { id: memoryId, userId } });
    if (!existing) throw new NotFoundException('Anı bulunamadı');
    if ((dto.imageUrls?.length ?? 0) > MAX_MEMORY_IMAGES) {
      throw new BadRequestException(`Bir anıya en fazla ${MAX_MEMORY_IMAGES} fotoğraf ekleyebilirsiniz`);
    }
    return this.prisma.coupleMemory.update({
      where: { id: memoryId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.date !== undefined && { date: new Date(dto.date) }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.emoji !== undefined && { emoji: dto.emoji }),
        ...(dto.notes !== undefined && { notes: dto.notes || null }),
        ...(dto.imageUrls !== undefined && {
          imageUrls: await this.media.persistMany(userId, 'memory', dto.imageUrls.slice(0, MAX_MEMORY_IMAGES)),
        }),
      },
    });
  }

  async deleteMemory(userId: string, memoryId: string) {
    const existing = await this.prisma.coupleMemory.findFirst({ where: { id: memoryId, userId } });
    if (!existing) throw new NotFoundException('Anı bulunamadı');
    await this.prisma.coupleMemory.delete({ where: { id: memoryId } });
    return { success: true };
  }

  async getDoctorSummary(userId: string) {
    const now = new Date();
    const since90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const [user, cycles, symptoms, pregnancy, assessment, relationship] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, nickname: true, birthYear: true, gender: true, heightCm: true, weightKg: true },
      }),
      this.prisma.periodCycle.findMany({
        where: { userId },
        orderBy: { startDate: 'desc' },
        take: 8,
      }),
      this.prisma.symptom.findMany({
        where: { userId, date: { gte: since90 } },
        orderBy: { date: 'desc' },
      }),
      this.prisma.pregnancy.findUnique({ where: { userId } }),
      this.prisma.fertilityAssessment.findUnique({ where: { userId } }),
      this.prisma.relationship.findUnique({ where: { userId } }),
    ]);

    if (!user) throw new NotFoundException('Kullanıcı bulunamadı');

    const cycleLengths = cycles.map((c) => c.cycleLength).filter((n) => n > 0);
    const periodLengths = cycles.map((c) => c.periodLength).filter((n) => n > 0);
    const avg = (arr: number[]) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null);

    const symptomMap = new Map<string, { count: number; maxSeverity: number; lastDate: Date }>();
    for (const s of symptoms) {
      const prev = symptomMap.get(s.type) || { count: 0, maxSeverity: 0, lastDate: s.date };
      prev.count += 1;
      prev.maxSeverity = Math.max(prev.maxSeverity, s.severity);
      if (s.date > prev.lastDate) prev.lastDate = s.date;
      symptomMap.set(s.type, prev);
    }

    const topSymptoms = [...symptomMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 12)
      .map(([type, v]) => ({
        type,
        count: v.count,
        maxSeverity: v.maxSeverity,
        lastDate: v.lastDate.toISOString().slice(0, 10),
      }));

    let pregnancySummary: any = null;
    if (pregnancy?.isActive) {
      const prog = calculatePregnancyProgress(pregnancy.lastMenstrualPeriod, pregnancy.dueDate, now);
      pregnancySummary = {
        isActive: true,
        babyName: pregnancy.babyName,
        lastMenstrualPeriod: pregnancy.lastMenstrualPeriod.toISOString().slice(0, 10),
        dueDate: pregnancy.dueDate.toISOString().slice(0, 10),
        currentWeek: prog.week,
        currentDay: prog.day,
        daysRemaining: prog.daysRemaining,
      };
    }

    return {
      generatedAt: now.toISOString(),
      profile: {
        name: user.nickname || user.name,
        birthYear: user.birthYear,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
      },
      cycle: {
        totalLogged: cycles.length,
        averageCycleLength: avg(cycleLengths),
        averagePeriodLength: avg(periodLengths),
        lastCycles: cycles.map((c) => ({
          startDate: c.startDate.toISOString().slice(0, 10),
          endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : null,
          cycleLength: c.cycleLength,
          periodLength: c.periodLength,
        })),
      },
      symptoms: {
        totalLast90Days: symptoms.length,
        top: topSymptoms,
        recent: symptoms.slice(0, 30).map((s) => ({
          date: s.date.toISOString().slice(0, 10),
          type: s.type,
          severity: s.severity,
          notes: s.notes,
        })),
      },
      pregnancy: pregnancySummary,
      assessment: assessment
        ? {
            goal: assessment.goal,
            tryingDuration: assessment.tryingDuration,
            cycleRegularity: assessment.cycleRegularity,
            healthConditions: assessment.healthConditions,
            score: assessment.score,
          }
        : null,
      relationship: relationship
        ? { partnerName: relationship.partnerName, startDate: relationship.startDate.toISOString().slice(0, 10) }
        : null,
    };
  }
}
