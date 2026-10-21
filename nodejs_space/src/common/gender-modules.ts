import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export function isMaleGender(gender?: string | null): boolean {
  return gender === 'male';
}

export function filterModulesForGender(modules: string[] | undefined, gender?: string | null): string[] {
  const list = Array.isArray(modules) ? [...modules] : [];
  if (isMaleGender(gender)) return ['relationship'];
  return list;
}

export async function assertUserNotMale(
  prisma: PrismaService,
  userId: string,
  featureName = 'regl veya gebelik',
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gender: true },
  });
  if (isMaleGender(user?.gender)) {
    throw new ForbiddenException(`Erkek kullanıcılar kişisel ${featureName} verisi oluşturamaz veya görüntüleyemez.`);
  }
}
