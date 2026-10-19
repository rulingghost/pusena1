import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { filterModulesForGender } from '../common/gender-modules';

export type InsightLevel = 'info' | 'tip' | 'warning' | 'danger' | 'success';

export interface Insight {
  id: string;
  level: InsightLevel;
  module: string;
  title: string;
  body: string;
  reason: string;
  action?: string;
  route?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class InsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async getInsights(userId: string): Promise<{ items: Insight[] }> {
    const [user, settings, pregnancy, cycles, symptoms, assessment] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.userSettings.findUnique({ where: { userId } }),
      this.prisma.pregnancy.findUnique({ where: { userId } }),
      this.prisma.periodCycle.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 6 }),
      this.prisma.symptom.findMany({
        where: { userId, date: { gte: new Date(Date.now() - 60 * DAY_MS) } },
        orderBy: { date: 'desc' },
        take: 200,
      }),
      this.prisma.fertilityAssessment.findUnique({ where: { userId } }),
    ]);

    const modules = filterModulesForGender(settings?.activeModules ?? [], user?.gender);
    const items: Insight[] = [];

    if (user?.gender !== 'male' && modules.includes('period')) {
      items.push(...this.cycleInsights(cycles));
    }
    if (user?.gender !== 'male' && modules.includes('pregnancy') && pregnancy) {
      items.push(...this.pregnancyInsights(pregnancy));
    }
    if (user?.gender !== 'male') {
      items.push(...this.symptomInsights(symptoms, cycles[0] ?? null));
    }

    if (user?.gender !== 'male' && assessment) {
      items.push(...this.assessmentInsights(assessment, user));
    }

    if (user && !user.gender) {
      items.push({
        id: 'profile-gender',
        level: 'info',
        module: 'profil',
        title: 'Profilinizi tamamlayın',
        body: 'Cinsiyet bilginizi eklerseniz size uygun modüller ve partner rehberi açılır. Erkek hesaplarda regl ve gebelik takibi gösterilmez.',
        reason: 'Profilinizde cinsiyet henüz kayıtlı değil.',
        action: 'Profili düzenle',
        route: '/profile/edit',
      });
    }

    if (user?.gender === 'male') {
      items.push({
        id: 'partner-support',
        level: 'tip',
        module: 'ilişki',
        title: 'Partnerinizi nasıl desteklersiniz?',
        body: 'Ana ekranınız ilişki alanıdır. Partnerinizle eşleşince döngü veya gebelik özetini ve günlük destek ipuçlarını Partner Rehberi’nde görürsünüz.',
        reason: 'Erkek profilde regl ve gebelik modülleri gizlenir; odak ilişki ve destektir.',
        action: 'Partner rehberini aç',
        route: '/story/partner-guide',
      });
    }

    return { items: items.slice(0, 12) };
  }

  private cycleInsights(cycles: Array<{ startDate: Date; endDate: Date | null; cycleLength: number; periodLength: number }>): Insight[] {
    const out: Insight[] = [];
    if (cycles.length === 0) {
      return [{
        id: 'cycle-empty',
        level: 'info',
        module: 'regl',
        title: 'Döngü takibine başlayın',
        body: 'İlk regl tarihinizi girdiğinizde ovülasyon penceresi, PMS dönemi ve sonraki regl tahmininiz otomatik hesaplanır.',
        reason: 'Henüz kayıtlı bir döngünüz yok.',
        action: 'Takibi başlat',
        route: '/setup/period',
      }];
    }

    const latest = cycles[0];
    const cycleDay = Math.floor((Date.now() - latest.startDate.getTime()) / DAY_MS) + 1;
    const ovulationDay = latest.cycleLength - 14;

    if (cycles.length >= 3) {
      const lengths = cycles.map(c => c.cycleLength);
      const min = Math.min(...lengths);
      const max = Math.max(...lengths);
      const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
      const variation = max - min;

      if (variation >= 8) {
        out.push({
          id: 'cycle-irregular',
          level: 'warning',
          module: 'regl',
          title: 'Döngüleriniz düzensiz seyrediyor',
          body: `Son ${cycles.length} döngünüz ${min}-${max} gün arasında değişti (ortalama ${avg} gün). 8 günden fazla oynama yumurtlamanın her ay gerçekleşmediğine işaret edebilir.`,
          reason: `Kayıtlı döngü uzunluklarınız: ${lengths.join(', ')} gün.`,
          action: 'Geçmişi incele',
          route: '/period/history',
        });
      } else {
        out.push({
          id: 'cycle-regular',
          level: 'success',
          module: 'regl',
          title: 'Döngüleriniz düzenli',
          body: `Son ${cycles.length} döngünüzün ortalaması ${avg} gün ve sapma yalnızca ${variation} gün. Bu, düzenli yumurtladığınızın güçlü bir göstergesidir.`,
          reason: `Kayıtlı döngü uzunluklarınız: ${lengths.join(', ')} gün.`,
        });
      }

      if (avg < 21 || avg > 35) {
        out.push({
          id: 'cycle-length-abnormal',
          level: 'danger',
          module: 'regl',
          title: 'Döngü uzunluğunuz normal aralığın dışında',
          body: `Ortalama döngünüz ${avg} gün. Sağlıklı aralık 21-35 gündür. Bu durum 3 aydan uzun sürüyorsa hormon paneli önerilir.`,
          reason: `${cycles.length} döngü ortalaması hesaplandı.`,
        });
      }
    }

    if (cycleDay >= 1 && cycleDay <= latest.periodLength) {
      out.push({
        id: 'cycle-menstrual',
        level: 'info',
        module: 'regl',
        title: `Regl döneminizin ${cycleDay}. günü`,
        body: 'Östrojen ve progesteron en düşük seviyede. Enerji düşüklüğü, kramp ve baş ağrısı bu dönemde beklenen belirtilerdir.',
        reason: `Son regliniz ${latest.startDate.toLocaleDateString('tr-TR')} tarihinde başladı.`,
        action: 'Semptom kaydet',
        route: '/period/symptoms',
      });
    } else if (Math.abs(cycleDay - ovulationDay) <= 1) {
      out.push({
        id: 'cycle-ovulation',
        level: 'success',
        module: 'regl',
        title: 'Yumurtlama günündesiniz',
        body: 'Doğurganlığınız en yüksek seviyede. Servikal akıntı şeffaf ve esnek kıvamda olabilir, bazal sıcaklığınız yarın 0.3-0.5 °C yükselecektir.',
        reason: `${latest.cycleLength} günlük döngünüzde yumurtlama ${ovulationDay}. güne denk geliyor; bugün ${cycleDay}. gündesiniz.`,
      });
    } else if (cycleDay >= ovulationDay - 5 && cycleDay < ovulationDay) {
      out.push({
        id: 'cycle-fertile',
        level: 'success',
        module: 'regl',
        title: 'Doğurganlık pencerenizdesiniz',
        body: `Yumurtlamanıza ${ovulationDay - cycleDay} gün kaldı. Sperm 3-5 gün canlı kalabildiği için bu günlerdeki ilişki gebe kalma şansını en üst düzeye çıkarır.`,
        reason: `Döngünüzün ${cycleDay}. günündesiniz; tahmini yumurtlama ${ovulationDay}. gün.`,
      });
    } else if (cycleDay > ovulationDay + 2) {
      const daysToPeriod = latest.cycleLength - cycleDay;
      if (daysToPeriod >= 0 && daysToPeriod <= 7) {
        out.push({
          id: 'cycle-pms',
          level: 'tip',
          module: 'regl',
          title: `PMS dönemi — reglinize ${daysToPeriod} gün`,
          body: 'Progesteron düşüşü serotonini etkileyerek sinirlilik, şişkinlik ve tatlı isteği yaratabilir. Magnezyum ve düzenli uyku bu belirtileri hafifletir.',
          reason: `Luteal evrenin ${cycleDay - ovulationDay}. günündesiniz.`,
        });
      }
      if (daysToPeriod < -3) {
        out.push({
          id: 'cycle-late',
          level: 'warning',
          module: 'regl',
          title: `Regliniz ${Math.abs(daysToPeriod)} gün gecikti`,
          body: 'Stres, seyahat, uyku düzensizliği veya ani kilo değişimi gecikmeye yol açabilir. Gebelik ihtimali varsa test yapmayı düşünebilirsiniz.',
          reason: `Beklenen regl tarihi ${new Date(latest.startDate.getTime() + latest.cycleLength * DAY_MS).toLocaleDateString('tr-TR')} idi.`,
        });
      }
    }

    return out;
  }

  private pregnancyInsights(p: { lastMenstrualPeriod: Date; dueDate: Date }): Insight[] {
    const totalDays = Math.floor((Date.now() - p.lastMenstrualPeriod.getTime()) / DAY_MS);
    const week = Math.max(1, Math.min(42, Math.floor(totalDays / 7) + 1));
    const daysRemaining = Math.max(0, Math.ceil((p.dueDate.getTime() - Date.now()) / DAY_MS));
    const out: Insight[] = [];

    if (week <= 13) {
      out.push({
        id: 'preg-t1',
        level: 'tip',
        module: 'gebelik',
        title: `${week}. hafta — 1. trimester`,
        body: 'Bebeğinizin nöral tüpü ve organları şekilleniyor. Günlük 400 mcg folik asit bu dönemde en kritik takviyedir.',
        reason: `Son adet tarihinize göre ${week}. haftadasınız.`,
        route: '/pregnancy',
      });
    } else if (week <= 27) {
      out.push({
        id: 'preg-t2',
        level: 'info',
        module: 'gebelik',
        title: `${week}. hafta — 2. trimester`,
        body: 'Enerjinizin arttığı altın dönemdesiniz. 20. hafta detaylı ultrason (anomali taraması) ve 24-28. hafta şeker yükleme testi planlanmalı.',
        reason: `Gebeliğinizin ${week}. haftasındasınız.`,
        route: '/pregnancy',
      });
    } else {
      out.push({
        id: 'preg-t3',
        level: 'warning',
        module: 'gebelik',
        title: `${week}. hafta — doğuma ${daysRemaining} gün`,
        body: 'Günlük bebek hareketlerini sayın. 2 saat içinde 10 hareket hissetmiyorsanız veya hareketlerde belirgin azalma varsa vakit kaybetmeden hastaneye başvurun.',
        reason: `3. trimesterdesiniz (${week}. hafta).`,
        route: '/pregnancy/kick-counter',
      });
    }

    if (week >= 24 && week <= 28) {
      out.push({
        id: 'preg-gd',
        level: 'warning',
        module: 'gebelik',
        title: 'Şeker yükleme testi zamanı',
        body: 'Gestasyonel diyabet taraması 24-28. haftalar arasında yapılmalıdır. Erken tanı hem sizin hem bebeğin sağlığı için önemlidir.',
        reason: `Şu an ${week}. haftadasınız.`,
      });
    }
    if (week >= 35 && week <= 37) {
      out.push({
        id: 'preg-gbs',
        level: 'warning',
        module: 'gebelik',
        title: 'Grup B Streptokok (GBS) testi',
        body: 'GBS taraması 35-37. haftalar arasında önerilir. Pozitif çıkarsa doğumda antibiyotik ile bebeğe geçiş engellenir.',
        reason: `Şu an ${week}. haftadasınız.`,
      });
    }

    return out;
  }

  private symptomInsights(
    symptoms: Array<{ type: string; severity: number; date: Date }>,
    latestCycle: { startDate: Date; cycleLength: number } | null,
  ): Insight[] {
    if (symptoms.length === 0) return [];
    const out: Insight[] = [];

    const counts = new Map<string, number>();
    for (const s of symptoms) counts.set(s.type, (counts.get(s.type) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const [topType, topCount] = sorted[0];

    if (topCount >= 3) {
      out.push({
        id: 'symptom-top',
        level: 'info',
        module: 'semptom',
        title: `En sık kaydettiğiniz belirti: ${topType}`,
        body: `Son 60 günde ${topCount} kez "${topType}" kaydettiniz. Bu belirtinin döngünüzün hangi evresinde yoğunlaştığını görmek için geçmiş kayıtlarınızı inceleyin.`,
        reason: `${symptoms.length} semptom kaydı analiz edildi.`,
        action: 'Geçmişi gör',
        route: '/period/history',
      });
    }

    const severe = symptoms.filter(s => s.severity >= 3);
    if (severe.length >= 3) {
      out.push({
        id: 'symptom-severe',
        level: 'danger',
        module: 'semptom',
        title: 'Tekrarlayan şiddetli belirtiler',
        body: `Son 60 günde ${severe.length} kez şiddeti yüksek belirti kaydettiniz. Günlük yaşamınızı etkileyen ağrılar normal karşılanmamalı; bir hekime danışın.`,
        reason: `Şiddet düzeyi 3 olan kayıtlar: ${[...new Set(severe.map(s => s.type))].slice(0, 4).join(', ')}.`,
      });
    }

    if (latestCycle) {
      const lutealSymptoms = symptoms.filter(s => {
        const day = Math.floor((s.date.getTime() - latestCycle.startDate.getTime()) / DAY_MS) + 1;
        return day > latestCycle.cycleLength - 14;
      });
      if (lutealSymptoms.length >= 4) {
        out.push({
          id: 'symptom-luteal',
          level: 'tip',
          module: 'semptom',
          title: 'Belirtileriniz luteal evrede yoğunlaşıyor',
          body: `Kayıtlarınızın ${lutealSymptoms.length} tanesi yumurtlama sonrası döneme denk geliyor. Bu tipik bir PMS örüntüsüdür; regle 1 hafta kala programınızı hafifletmeyi deneyebilirsiniz.`,
          reason: 'Semptom tarihleri döngü evrelerinizle eşleştirildi.',
        });
      }
    }

    return out;
  }

  private assessmentInsights(
    a: { score: number | null; healthConditions: string[]; tryingDuration: string | null },
    user: { birthYear: number | null } | null,
  ): Insight[] {
    const out: Insight[] = [];

    if (a.score !== null && a.score < 70) {
      out.push({
        id: 'assessment-score',
        level: 'warning',
        module: 'doğurganlık',
        title: `Doğurganlık değerlendirme skorunuz: ${a.score}/100`,
        body: 'Skorunuzu düşüren faktörleri ve size özel önerileri değerlendirme sayfasından görebilirsiniz.',
        reason: 'Doldurduğunuz doğurganlık değerlendirmesi baz alındı.',
        action: 'Değerlendirmeyi gör',
        route: '/profile/assessment',
      });
    }

    if (a.tryingDuration === '12plus') {
      out.push({
        id: 'assessment-ttc',
        level: 'danger',
        module: 'doğurganlık',
        title: '12 aydan uzun süredir deniyorsunuz',
        body: 'Bir yıl boyunca korunmasız ilişkiye rağmen gebelik oluşmadıysa hem sizin hem partnerinizin değerlendirilmesi önerilir.',
        reason: 'Değerlendirmede belirttiğiniz deneme süresi.',
      });
    }

    if (user?.birthYear) {
      const age = new Date().getFullYear() - user.birthYear;
      if (age >= 35) {
        out.push({
          id: 'assessment-age',
          level: 'info',
          module: 'doğurganlık',
          title: `${age} yaşındasınız`,
          body: '35 yaş sonrası yumurta rezervi kademeli azalır. Gebelik planlıyorsanız değerlendirme süresini 12 ay yerine 6 ay olarak planlamak önerilir.',
          reason: 'Profilinizdeki doğum yılı bilgisi kullanıldı.',
        });
      }
    }

    return out;
  }
}
