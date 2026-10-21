import { ForbiddenException } from '@nestjs/common';
import { PregnancyService } from './pregnancy.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PregnancyService (Male Guard)', () => {
  let service: PregnancyService;
  let mockPrisma: Partial<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      } as any,
      pregnancy: {
        findUnique: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      } as any,
      pregnancyWeekContent: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      } as any,
    };
    service = new PregnancyService(mockPrisma as PrismaService);
  });

  it('rejects male user from createPregnancy with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.createPregnancy('male-1', '2026-05-01', 'Baby')).rejects.toThrow(ForbiddenException);
  });

  it('rejects male user from getPregnancy with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.getPregnancy('male-1')).rejects.toThrow(ForbiddenException);
  });

  it('rejects male user from deletePregnancy with ForbiddenException', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'male' });

    await expect(service.deletePregnancy('male-1')).rejects.toThrow(ForbiddenException);
  });

  it('allows female user to getPregnancy', async () => {
    (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ gender: 'female' });
    (mockPrisma.pregnancy!.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await service.getPregnancy('female-1');
    expect(res).toBeNull();
  });

  it('fetches baby names from prisma when available', async () => {
    (mockPrisma as any).babyName = {
      count: jest.fn().mockResolvedValue(2),
      createMany: jest.fn(),
      findMany: jest.fn().mockResolvedValue([
        { id: 'bn-1', name: 'Defne', gender: 'girl', meaning: 'Zafer', origin: 'Yunanca', isPopular: true },
        { id: 'bn-2', name: 'Zeynep', gender: 'girl', meaning: 'Süs', origin: 'Arapça', isPopular: true },
      ]),
    };

    const res = await service.getBabyNames('girl', 'Def');
    expect(res.items).toHaveLength(2);
    expect(res.items[0].name).toBe('Defne');
  });

  it('auto-seeds baby names if database table is empty', async () => {
    const createManyMock = jest.fn().mockResolvedValue({ count: 50 });
    (mockPrisma as any).babyName = {
      count: jest.fn().mockResolvedValue(0),
      createMany: createManyMock,
      findMany: jest.fn().mockResolvedValue([
        { id: 'bn-1', name: 'Simay', gender: 'girl', meaning: 'Gümüş', origin: 'Türkçe', isPopular: true },
      ]),
    };

    const res = await service.getBabyNames();
    expect(createManyMock).toHaveBeenCalled();
    expect(res.items[0].name).toBe('Simay');
  });
});
