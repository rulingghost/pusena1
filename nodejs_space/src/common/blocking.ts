import { PrismaService } from '../prisma/prisma.service';

/**
 * İki yönlü engelleme listesini getirir:
 * Kullanıcının engellediği kişiler VE kullanıcıyı engelleyen kişiler.
 */
export async function getBlockedUserIds(prisma: PrismaService, userId?: string | null): Promise<string[]> {
  if (!userId) return [];

  const [blockedByMe, blockedMe] = await Promise.all([
    prisma.blockedUser.findMany({
      where: { userId },
      select: { blockedUserId: true },
    }),
    prisma.blockedUser.findMany({
      where: { blockedUserId: userId },
      select: { userId: true },
    }),
  ]);

  const ids = new Set<string>();
  for (const b of blockedByMe) ids.add(b.blockedUserId);
  for (const b of blockedMe) ids.add(b.userId);

  return Array.from(ids);
}

/**
 * İki kullanıcı arasında (herhangi bir yönde) aktif engelleme olup olmadığını denetler.
 */
export async function areUsersBlocked(prisma: PrismaService, userA?: string | null, userB?: string | null): Promise<boolean> {
  if (!userA || !userB || userA === userB) return false;

  const count = await prisma.blockedUser.count({
    where: {
      OR: [
        { userId: userA, blockedUserId: userB },
        { userId: userB, blockedUserId: userA },
      ],
    },
  });

  return count > 0;
}
