import { PrismaService } from '../prisma/prisma.service';

export async function getPairUserIds(prisma: PrismaService, userId: string): Promise<string[]> {
  const linked = await ensureMutualPair(prisma, userId);
  return linked.partnerId ? [userId, linked.partnerId] : [userId];
}

export function makePartnerCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BL-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function normalizePartnerCode(raw: string): string[] {
  let cleaned = (raw ?? '')
    .trim()
    .toLocaleUpperCase('en-US')
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9-]/g, '');

  if (/^PUSENA[A-Z0-9]/.test(cleaned) && !cleaned.startsWith('PUSENA-')) {
    cleaned = `PUSENA-${cleaned.slice(6)}`;
  } else if (/^BLOOM[A-Z0-9]/.test(cleaned) && !cleaned.startsWith('BLOOM-')) {
    cleaned = `BLOOM-${cleaned.slice(5)}`;
  } else if (/^BL[A-Z0-9]/.test(cleaned) && !cleaned.startsWith('BL-') && !cleaned.startsWith('BLOOM')) {
    cleaned = `BL-${cleaned.slice(2)}`;
  }

  const withoutPrefix = cleaned.replace(/^(PUSENA-|BLOOM-|PS-|BL-)/, '');
  const withBl = withoutPrefix ? `BL-${withoutPrefix}` : '';
  const withBloom = withoutPrefix ? `BLOOM-${withoutPrefix}` : '';
  const withPs = withoutPrefix ? `PS-${withoutPrefix}` : '';
  const withPusena = withoutPrefix ? `PUSENA-${withoutPrefix}` : '';
  return [...new Set([cleaned, withBl, withBloom, withPs, withPusena, withoutPrefix].filter((c) => c.length >= 4))];
}

export async function findUserByPartnerCode(prisma: PrismaService, raw: string) {
  const variants = normalizePartnerCode(raw);
  if (!variants.length) return null;

  const suffix = variants
    .map((v) => v.replace(/^(PUSENA-|BLOOM-|PS-|BL-)/, ''))
    .sort((a, b) => b.length - a.length)[0];

  const exact = await prisma.user.findFirst({
    where: {
      OR: variants.map((v) => ({ partnerCode: { equals: v, mode: 'insensitive' as const } })),
    },
  });
  if (exact) return exact;

  if (suffix && suffix.length >= 6) {
    return prisma.user.findFirst({
      where: { partnerCode: { endsWith: suffix, mode: 'insensitive' } },
    });
  }
  return null;
}

export async function ensureMutualPair(prisma: PrismaService, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, pairedUserId: true, partnerCode: true, name: true, nickname: true, email: true, gender: true },
  });
  if (!user?.pairedUserId) {
    return { user, partner: null, partnerId: null as string | null, isPaired: false };
  }

  const partner = await prisma.user.findUnique({
    where: { id: user.pairedUserId },
    select: { id: true, pairedUserId: true, partnerCode: true, name: true, nickname: true, email: true, gender: true },
  });

  if (!partner) {
    await prisma.user.update({ where: { id: userId }, data: { pairedUserId: null } });
    return { user: { ...user, pairedUserId: null }, partner: null, partnerId: null, isPaired: false };
  }

  if (partner.pairedUserId && partner.pairedUserId !== userId) {
    await prisma.user.update({ where: { id: userId }, data: { pairedUserId: null } });
    return { user: { ...user, pairedUserId: null }, partner: null, partnerId: null, isPaired: false };
  }

  if (!partner.pairedUserId) {
    await prisma.user.update({ where: { id: partner.id }, data: { pairedUserId: userId } });
  }

  return { user, partner, partnerId: partner.id, isPaired: true };
}
