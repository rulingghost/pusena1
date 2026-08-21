import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SymptomItemDto } from './dto/symptoms.dto';

@Injectable()
export class SymptomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSymptoms(userId: string, dateStr: string, items: SymptomItemDto[]) {
    const date = new Date(dateStr);
    // Remove existing symptoms for this date
    await this.prisma.symptom.deleteMany({ where: { userId, date } });

    const created = await Promise.all(
      items.map(item =>
        this.prisma.symptom.create({
          data: { userId, date, type: item.type, severity: item.severity, notes: item.notes },
        }),
      ),
    );

    return {
      date,
      symptoms: created.map(s => ({ id: s.id, type: s.type, severity: s.severity, notes: s.notes })),
    };
  }

  async getSymptoms(userId: string, dateStr: string) {
    const date = new Date(dateStr);
    const symptoms = await this.prisma.symptom.findMany({
      where: { userId, date },
      orderBy: { createdAt: 'asc' },
    });

    return {
      date,
      symptoms: symptoms.map(s => ({ id: s.id, type: s.type, severity: s.severity, notes: s.notes })),
    };
  }

  async getHistory(userId: string) {
    const symptoms = await this.prisma.symptom.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 200,
    });

    return {
      items: symptoms.map(s => ({
        id: s.id,
        date: s.date,
        type: s.type,
        severity: s.severity,
        notes: s.notes,
        createdAt: s.createdAt,
      })),
      total: symptoms.length,
    };
  }

  async deleteSymptom(userId: string, symptomId: string) {
    await this.prisma.symptom.deleteMany({
      where: { id: symptomId, userId },
    });
    return { success: true };
  }

  private readonly defaultCategories = [
    {
      category: 'Ovülasyon testi',
      types: ['Test yapmadım', 'Test: pozitif', 'Test: negatif', 'Ovülasyon: kendi yöntemim'],
    },
    {
      category: 'Gebelik testi',
      types: ['Test yapmadım', 'Pozitif', 'Negatif', 'Soluk çizgi'],
    },
    {
      category: 'Cinsel ilişki ve istek',
      types: [
        'Yapmadım',
        'Korunmalı cinsel ilişki',
        'Korunmasız cinsel ilişki',
        'Oral seks',
        'Anal seks',
        'Mastürbasyon',
        'Haz veren dokunma',
        'Seks oyuncakları',
        'Orgazm',
        'Yüksek cinsel istek',
        'Nötr seviyede cinsel istek',
        'Düşük seviyede cinsel istek',
      ],
    },
    {
      category: 'Ruh hali',
      types: [
        'Sakinim',
        'Mutluyum',
        'Enerjiğim',
        'Cıvıl cıvılım',
        'Ruh halim dengesiz',
        'Rahatsız hissediyorum',
        'Üzgünüm',
        'Endişeliyim',
        'Depresifim',
        'Suçluluk hissediyorum',
        'Obsesif düşünceler',
        'Enerjim düşük',
        'Hissizim',
        'Aklım karışık',
        'Kendimi çok eleştiriyorum',
      ],
    },
    {
      category: 'Belirtiler',
      types: [
        'Her şey yolunda',
        'Kramp',
        'Göğüs Hassasiyeti',
        'Baş Ağrısı',
        'Akne',
        'Bel Ağrısı',
        'Halsizlik',
        'Aşermeler',
        'Uykusuzluk',
        'Karın ağrısı',
        'Vajinada kaşınma',
        'Vajina kuruluğu',
      ],
    },
    {
      category: 'Vajinal akıntı',
      types: [
        'Akıntı yok',
        'Kaygan',
        'Sulu',
        'Yapışkan',
        'Yumurta akı',
        'Lekelenme',
        'Olağandışı',
        'Beyaz, topaklı',
        'Gri',
      ],
    },
    {
      category: 'Sindirim ve dışkı',
      types: ['Bulantı', 'Şişkinlik', 'Kabızlık', 'İshal'],
    },
    {
      category: 'Fiziksel aktivite',
      types: [
        'Egzersiz yapmadım',
        'Yoga',
        'Ağırlık',
        'Aerobik ve dans',
        'Yüzme',
        'Takım sporları',
        'Koşu',
        'Bisiklet',
        'Yürüyüş',
      ],
    },
    {
      category: 'Diğer',
      types: [
        'Seyahat',
        'Stres',
        'Meditasyon',
        'Günlük tutma',
        'Kegel egzersizleri',
        'Nefes egzersizleri',
        'Alkol',
        'İlaçlar',
      ],
    },
  ];

  async getSymptomTypes() {
    const count = await this.prisma.symptomType.count();
    if (count === 0) {
      let order = 1;
      for (const cat of this.defaultCategories) {
        for (const name of cat.types) {
          try {
            await this.prisma.symptomType.create({
              data: { category: cat.category, name, displayOrder: order++ },
            });
          } catch (e) {
            // Ignore if duplicate
          }
        }
      }
    }

    const types = await this.prisma.symptomType.findMany({ orderBy: { displayOrder: 'asc' } });
    const categoryMap = new Map<string, string[]>();
    for (const t of types) {
      if (!categoryMap.has(t.category)) categoryMap.set(t.category, []);
      categoryMap.get(t.category)!.push(t.name);
    }
    
    // Ensure all default categories exist in response
    if (categoryMap.size === 0) {
      return {
        categories: this.defaultCategories.map(c => ({ name: c.category, types: c.types })),
      };
    }

    return {
      categories: Array.from(categoryMap.entries()).map(([name, types]) => ({ name, types })),
    };
  }
}
