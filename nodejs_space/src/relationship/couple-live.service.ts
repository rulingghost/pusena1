import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureMutualPair } from '../common/pair';

export const NUDGE_CATALOG: Record<string, { label: string; emoji: string; body: string }> = {
  massage: { label: 'Masaj', emoji: '💆', body: 'Masaj istiyor' },
  calm: { label: 'Huzur', emoji: '🌿', body: 'Sakin bir an / huzur istiyor' },
  intimacy: { label: 'Yakınlık', emoji: '💕', body: 'Yakınlık istiyor' },
  hug: { label: 'Sarılmak', emoji: '🤗', body: 'Sarılmak istiyor' },
  talk: { label: 'Konuşalım', emoji: '💬', body: 'Konuşmak istiyor' },
  food: { label: 'İkram', emoji: '🍵', body: 'Bir şeyler içmek/yemek istiyor' },
  space: { label: 'Alan', emoji: '🌙', body: 'Biraz alan istiyor' },
  help: { label: 'Yardım', emoji: '✋', body: 'Yardım istiyor' },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function freshness(updatedAt?: Date | null) {
  if (!updatedAt) return 'none';
  const mins = (Date.now() - updatedAt.getTime()) / 60000;
  if (mins < 5) return 'live';
  if (mins < 60) return 'recent';
  return 'stale';
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join(':');
}

@Injectable()
export class CoupleLiveService {
  constructor(private readonly prisma: PrismaService) {}

  private async requirePair(userId: string) {
    const linked = await ensureMutualPair(this.prisma, userId);
    if (!linked.isPaired || !linked.partner || !linked.user) {
      throw new ForbiddenException('Önce partner kodu ile eşleşin');
    }
    return {
      user: linked.user,
      partner: linked.partner,
      partnerName: linked.partner.nickname || linked.partner.name,
      myName: linked.user.nickname || linked.user.name,
      key: pairKey(userId, linked.partner.id),
    };
  }

  catalog() {
    return Object.entries(NUDGE_CATALOG).map(([id, v]) => ({ id, ...v }));
  }

  async getLocation(userId: string) {
    const { partner } = await this.requirePair(userId);
    const [mine, theirs] = await Promise.all([
      this.prisma.partnerLocation.findUnique({ where: { userId } }),
      this.prisma.partnerLocation.findUnique({ where: { userId: partner.id } }),
    ]);
    const myLat = mine?.sharingEnabled ? mine.latitude : null;
    const myLng = mine?.sharingEnabled ? mine.longitude : null;
    const theirLat = theirs?.sharingEnabled ? theirs.latitude : null;
    const theirLng = theirs?.sharingEnabled ? theirs.longitude : null;
    const both = myLat != null && myLng != null && theirLat != null && theirLng != null;
    return {
      distanceKm: both ? haversineKm(myLat, myLng, theirLat, theirLng) : null,
      mine: mine
        ? {
            sharingEnabled: mine.sharingEnabled,
            latitude: mine.sharingEnabled ? mine.latitude : null,
            longitude: mine.sharingEnabled ? mine.longitude : null,
            accuracy: mine.sharingEnabled ? mine.accuracy : null,
            updatedAt: mine.updatedAt,
            freshness: mine.sharingEnabled ? freshness(mine.updatedAt) : 'none',
          }
        : { sharingEnabled: false, latitude: null, longitude: null, accuracy: null, updatedAt: null, freshness: 'none' },
      partner: {
        sharingEnabled: !!theirs?.sharingEnabled,
        latitude: theirLat,
        longitude: theirLng,
        accuracy: theirs?.sharingEnabled ? theirs.accuracy : null,
        updatedAt: theirs?.updatedAt ?? null,
        name: partner.nickname || partner.name,
        freshness: theirs?.sharingEnabled ? freshness(theirs.updatedAt) : 'none',
      },
    };
  }

  async upsertLocation(userId: string, dto: { latitude?: number; longitude?: number; accuracy?: number; sharingEnabled?: boolean }) {
    await this.requirePair(userId);
    const existing = await this.prisma.partnerLocation.findUnique({ where: { userId } });
    const sharingEnabled = dto.sharingEnabled ?? existing?.sharingEnabled ?? false;
    const latitude = dto.latitude ?? existing?.latitude;
    const longitude = dto.longitude ?? existing?.longitude;
    if (sharingEnabled && (latitude == null || longitude == null)) {
      throw new BadRequestException('Konum paylaşmak için koordinat gerekli');
    }
    const row = await this.prisma.partnerLocation.upsert({
      where: { userId },
      update: {
        sharingEnabled,
        ...(dto.latitude != null && { latitude: dto.latitude }),
        ...(dto.longitude != null && { longitude: dto.longitude }),
        ...(dto.accuracy != null && { accuracy: dto.accuracy }),
      },
      create: {
        userId,
        sharingEnabled,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        accuracy: dto.accuracy ?? null,
      },
    });
    return { sharingEnabled: row.sharingEnabled, updatedAt: row.updatedAt };
  }

  async listNudges(userId: string) {
    const { partner, key } = await this.requirePair(userId);
    const items = await this.prisma.partnerNudge.findMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: partner.id },
          { fromUserId: partner.id, toUserId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 40,
    });
    const ids = items.map((n) => n.id);
    const replies = ids.length
      ? await this.prisma.coupleMessage.findMany({
          where: { pairKey: key, nudgeId: { in: ids } },
          orderBy: { createdAt: 'asc' },
        })
      : [];
    const byNudge = new Map<string, typeof replies>();
    for (const r of replies) {
      if (!r.nudgeId) continue;
      const list = byNudge.get(r.nudgeId) || [];
      list.push(r);
      byNudge.set(r.nudgeId, list);
    }
    return {
      catalog: this.catalog(),
      items: items.map((n) => {
        const meta = NUDGE_CATALOG[n.type] || { label: n.type, emoji: '💫', body: n.type };
        return {
          id: n.id,
          type: n.type,
          label: meta.label,
          emoji: meta.emoji,
          body: meta.body,
          status: n.status,
          fromMe: n.fromUserId === userId,
          createdAt: n.createdAt,
          replies: (byNudge.get(n.id) || []).map((m) => ({
            id: m.id,
            body: m.body,
            fromMe: m.senderId === userId,
            createdAt: m.createdAt,
          })),
        };
      }),
    };
  }

  async sendNudge(userId: string, type: string, comment?: string) {
    const meta = NUDGE_CATALOG[type];
    if (!meta) throw new BadRequestException('Geçersiz istek türü');
    const { partner, myName, key } = await this.requirePair(userId);
    const note = comment?.trim();

    // Çift dokunuş / yavaş ağ yüzünden gelen tekrarları hata yerine sessizce yut.
    const recent = await this.prisma.partnerNudge.findFirst({
      where: {
        fromUserId: userId,
        toUserId: partner.id,
        type,
        createdAt: { gte: new Date(Date.now() - 25 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (recent && !note) {
      return { id: recent.id, type, duplicate: true, ...meta };
    }

    const nudge = await this.prisma.partnerNudge.create({
      data: { fromUserId: userId, toUserId: partner.id, type },
    });
    if (note) {
      await this.prisma.coupleMessage.create({
        data: { pairKey: key, senderId: userId, body: note, kind: 'nudge_reply', nudgeId: nudge.id },
      });
    }
    void this.prisma.notification
      .create({
        data: {
          userId: partner.id,
          type: 'partner_nudge',
          module: 'relationship',
          title: `${meta.emoji} ${myName} ${meta.body}`,
          body: note ? note.slice(0, 120) : 'Yanıt yazabilir veya “şimdi olmaz” diyebilirsiniz.',
          referenceId: nudge.id,
        },
      })
      .catch(() => null);
    return { id: nudge.id, type, duplicate: false, ...meta };
  }

  async transferNudgeToChat(userId: string, nudgeId: string) {
    const { partner, key } = await this.requirePair(userId);
    const nudge = await this.prisma.partnerNudge.findFirst({
      where: {
        id: nudgeId,
        OR: [
          { fromUserId: userId, toUserId: partner.id },
          { fromUserId: partner.id, toUserId: userId },
        ],
      },
    });
    if (!nudge) throw new NotFoundException('İstek bulunamadı');
    const meta = NUDGE_CATALOG[nudge.type] || { label: nudge.type, emoji: '💫', body: nudge.type };
    const replies = await this.prisma.coupleMessage.findMany({
      where: { pairKey: key, nudgeId },
      orderBy: { createdAt: 'asc' },
    });
    const lines = [
      `${meta.emoji} ${meta.label} isteği`,
      ...replies.map((r) => r.body).filter((b) => b.trim()),
    ];
    const created = [];
    for (const body of lines) {
      created.push(
        await this.prisma.coupleMessage.create({
          data: { pairKey: key, senderId: userId, body, kind: 'chat', nudgeId: null },
        }),
      );
    }
    return { transferred: created.length };
  }

  async replyNudge(userId: string, nudgeId: string, body: string) {
    const text = body.trim();
    if (!text) throw new BadRequestException('Mesaj boş olamaz');
    const { partner, key, myName } = await this.requirePair(userId);
    const nudge = await this.prisma.partnerNudge.findFirst({
      where: {
        id: nudgeId,
        OR: [
          { fromUserId: userId, toUserId: partner.id },
          { fromUserId: partner.id, toUserId: userId },
        ],
      },
    });
    if (!nudge) throw new NotFoundException('İstek bulunamadı');
    const msg = await this.prisma.coupleMessage.create({
      data: { pairKey: key, senderId: userId, body: text, kind: 'nudge_reply', nudgeId },
    });
    const otherId = nudge.fromUserId === userId ? nudge.toUserId : nudge.fromUserId;
    void this.prisma.notification
      .create({
        data: {
          userId: otherId,
          type: 'couple_message',
          module: 'relationship',
          title: `${myName} isteğe yanıt verdi`,
          body: text.slice(0, 120),
          referenceId: nudge.id,
        },
      })
      .catch(() => null);
    return { id: msg.id, body: msg.body, createdAt: msg.createdAt, fromMe: true };
  }

  async deleteNudge(userId: string, nudgeId: string) {
    const { partner } = await this.requirePair(userId);
    const nudge = await this.prisma.partnerNudge.findFirst({
      where: {
        id: nudgeId,
        OR: [
          { fromUserId: userId, toUserId: partner.id },
          { fromUserId: partner.id, toUserId: userId },
        ],
      },
    });
    if (!nudge) throw new NotFoundException('İstek bulunamadı');

    await this.prisma.coupleMessage.deleteMany({ where: { nudgeId } });
    await this.prisma.partnerNudge.delete({ where: { id: nudgeId } });
    await this.prisma.notification.deleteMany({
      where: { referenceId: nudgeId, type: { in: ['partner_nudge', 'couple_message'] } },
    }).catch(() => {});
    return { success: true };
  }

  async listMessages(userId: string) {
    const { partner, key } = await this.requirePair(userId);

    // Sohbeti açan taraf, karşıdan gelen tüm mesajları okumuş sayılır.
    await this.prisma.coupleMessage
      .updateMany({
        where: { pairKey: key, senderId: partner.id, readAt: null },
        data: { readAt: new Date() },
      })
      .catch(() => null);
    await this.prisma.notification
      .updateMany({
        where: { userId, type: { in: ['couple_message', 'partner_nudge'] }, isRead: false },
        data: { isRead: true },
      })
      .catch(() => null);

    const items = await this.prisma.coupleMessage.findMany({
      where: { pairKey: key, kind: { in: ['chat', 'note'] } },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
    return {
      partnerName: partner.nickname || partner.name,
      items: items.map((m) => ({
        id: m.id,
        body: m.body,
        kind: m.kind,
        nudgeId: m.nudgeId,
        fromMe: m.senderId === userId,
        readAt: m.readAt,
        createdAt: m.createdAt,
      })),
    };
  }

  async sendMessage(userId: string, body: string, nudgeId?: string, kind?: string) {
    const text = body.trim();
    if (!text) throw new BadRequestException('Mesaj boş olamaz');
    const { partner, key, myName } = await this.requirePair(userId);
    const resolvedKind = nudgeId ? 'nudge_reply' : kind === 'note' ? 'note' : 'chat';
    const msg = await this.prisma.coupleMessage.create({
      data: { pairKey: key, senderId: userId, body: text, kind: resolvedKind, nudgeId: nudgeId || null },
    });
    // Bildirim satırı gönderim yanıtını bekletmesin.
    void this.prisma.notification
      .create({
        data: {
          userId: partner.id,
          type: 'couple_message',
          module: 'relationship',
          title: `${myName} size yazdı`,
          body: text.slice(0, 120),
          referenceId: msg.id,
        },
      })
      .catch(() => null);
    return {
      id: msg.id,
      body: msg.body,
      kind: msg.kind,
      fromMe: true,
      readAt: msg.readAt,
      createdAt: msg.createdAt,
    };
  }
}
