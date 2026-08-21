import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPairUserIds } from '../common/pair';

@Injectable()
export class SpecialDatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: { title: string; date: string; description?: string; isRecurring?: boolean; reminderDays?: number; reminderDaysList?: number[] }) {
    let relationship = await this.prisma.relationship.findUnique({ where: { userId } });
    if (!relationship) {
      relationship = await this.prisma.relationship.create({
        data: { userId, partnerName: 'Partnerim', startDate: new Date() },
      });
    }

    const sd = await this.prisma.specialDate.create({
      data: {
        userId,
        relationshipId: relationship.id,
        title: data.title,
        date: new Date(data.date),
        description: data.description || null,
        isRecurring: data.isRecurring ?? false,
        reminderDays: data.reminderDays ?? null,
        reminderDaysList: data.reminderDaysList ?? [1, 7],
      },
    });
    return this.format(sd, userId);
  }

  async getAll(userId: string, page: number, limit: number) {
    const ids = await getPairUserIds(this.prisma, userId);
    const where = { userId: { in: ids } };
    const [items, total] = await Promise.all([
      this.prisma.specialDate.findMany({
        where,
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.specialDate.count({ where }),
    ]);

    return {
      items: items.map((sd) => this.format(sd, userId)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(userId: string, id: string) {
    const ids = await getPairUserIds(this.prisma, userId);
    const sd = await this.prisma.specialDate.findFirst({ where: { id, userId: { in: ids } } });
    if (!sd) throw new NotFoundException('Özel tarih bulunamadı');
    return this.format(sd, userId);
  }

  async update(userId: string, id: string, data: { title?: string; date?: string; description?: string; isRecurring?: boolean; reminderDays?: number | null; reminderDaysList?: number[] }) {
    const ids = await getPairUserIds(this.prisma, userId);
    const existing = await this.prisma.specialDate.findFirst({ where: { id, userId: { in: ids } } });
    if (!existing) throw new NotFoundException('Özel tarih bulunamadı');
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.date) updateData.date = new Date(data.date);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;
    if (data.reminderDays !== undefined) updateData.reminderDays = data.reminderDays;
    if (data.reminderDaysList !== undefined) updateData.reminderDaysList = data.reminderDaysList;
    const sd = await this.prisma.specialDate.update({ where: { id }, data: updateData });
    return this.format(sd, userId);
  }

  async remove(userId: string, id: string) {
    const ids = await getPairUserIds(this.prisma, userId);
    const existing = await this.prisma.specialDate.findFirst({ where: { id, userId: { in: ids } } });
    if (!existing) throw new NotFoundException('Özel tarih bulunamadı');
    await this.prisma.specialDate.delete({ where: { id } });
    return { success: true };
  }

  private format(sd: any, viewerId?: string) {
    const now = new Date();
    let targetDate = new Date(sd.date);
    if (sd.isRecurring) {
      targetDate.setFullYear(now.getFullYear());
      if (targetDate < now) targetDate.setFullYear(now.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return {
      id: sd.id, title: sd.title, date: sd.date, description: sd.description,
      isRecurring: sd.isRecurring, reminderDays: sd.reminderDays, reminderDaysList: sd.reminderDaysList ?? [], daysUntil, createdAt: sd.createdAt,
      mine: viewerId ? sd.userId === viewerId : true,
    };
  }
}
