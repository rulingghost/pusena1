import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

// Relative conception probability per day of the fertile window (Wilcox et al.)
const WINDOW_PROBABILITY: Array<{ offset: number; label: string; chance: number }> = [
  { offset: -5, label: 'Yumurtlamaya 5 gün', chance: 10 },
  { offset: -4, label: 'Yumurtlamaya 4 gün', chance: 16 },
  { offset: -3, label: 'Yumurtlamaya 3 gün', chance: 24 },
  { offset: -2, label: 'Yumurtlamaya 2 gün', chance: 31 },
  { offset: -1, label: 'Yumurtlamaya 1 gün', chance: 33 },
  { offset: 0, label: 'Yumurtlama günü', chance: 27 },
  { offset: 1, label: 'Yumurtlamadan 1 gün sonra', chance: 8 },
];

@Injectable()
export class FertilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getFertilityOverview(userId: string) {
    const [cycles, assessment, user, symptoms] = await Promise.all([
      this.prisma.periodCycle.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 6 }),
      this.prisma.fertilityAssessment.findUnique({ where: { userId } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { birthYear: true, heightCm: true, weightKg: true } }),
      this.prisma.symptom.findMany({
        where: { userId, date: { gte: new Date(Date.now() - 90 * DAY_MS) } },
        select: { type: true, date: true },
      }),
    ]);

    if (cycles.length === 0) {
      return {
        hasData: false,
        message: 'Doğurganlık analizi için en az bir döngü kaydı gerekir. Regl takibini başlattığınızda bu sayfa kişisel verilerinizle dolacak.',
        cycleLength: null, ovulationDay: null, currentCycleDay: null, phase: null,
        fertileWindow: [], monthlyChance: null, factors: [], tips: [], nextOvulationDate: null,
      };
    }

    const latest = cycles[0];
    const avgCycleLength = Math.round(
      cycles.reduce((sum, c) => sum + c.cycleLength, 0) / cycles.length,
    );
    const lengths = cycles.map(c => c.cycleLength);
    const variation = Math.max(...lengths) - Math.min(...lengths);

    const ovulationDay = avgCycleLength - 14;
    const currentCycleDay = Math.floor((Date.now() - latest.startDate.getTime()) / DAY_MS) + 1;
    const ovulationDate = new Date(latest.startDate.getTime() + (ovulationDay - 1) * DAY_MS);

    let nextOvulationDate = ovulationDate;
    while (nextOvulationDate.getTime() < Date.now() - DAY_MS) {
      nextOvulationDate = new Date(nextOvulationDate.getTime() + avgCycleLength * DAY_MS);
    }

    const phase = this.resolvePhase(currentCycleDay, latest.periodLength, ovulationDay, avgCycleLength);

    const fertileWindow = WINDOW_PROBABILITY.map(w => {
      const date = new Date(nextOvulationDate.getTime() + w.offset * DAY_MS);
      const daysAway = Math.round((date.getTime() - Date.now()) / DAY_MS);
      return {
        label: w.label,
        date: date.toISOString().split('T')[0],
        chance: w.chance,
        daysAway,
        isToday: daysAway === 0,
      };
    });

    const { monthlyChance, factors } = this.estimateMonthlyChance({
      variation,
      avgCycleLength,
      birthYear: user?.birthYear ?? null,
      heightCm: user?.heightCm ?? assessment?.heightCm ?? null,
      weightKg: user?.weightKg ?? assessment?.weightKg ?? null,
      healthConditions: assessment?.healthConditions ?? [],
      tryingDuration: assessment?.tryingDuration ?? null,
      cycleCount: cycles.length,
    });

    const tips = this.buildTips(phase, currentCycleDay, ovulationDay, symptoms);

    return {
      hasData: true,
      message: null,
      cycleLength: avgCycleLength,
      cycleVariation: variation,
      cycleCount: cycles.length,
      ovulationDay,
      currentCycleDay,
      phase,
      fertileWindow,
      monthlyChance,
      factors,
      tips,
      nextOvulationDate: nextOvulationDate.toISOString().split('T')[0],
    };
  }

  private resolvePhase(day: number, periodLength: number, ovulationDay: number, cycleLength: number) {
    if (day <= periodLength) {
      return { key: 'menstrual', label: 'Regl evresi', description: 'Rahim iç zarı dökülüyor. Hormonlar en düşük seviyede.' };
    }
    if (day < ovulationDay - 5) {
      return { key: 'follicular', label: 'Foliküler evre', description: 'Östrojen yükseliyor, foliküller olgunlaşıyor. Enerjiniz artacak.' };
    }
    if (day < ovulationDay) {
      return { key: 'fertile', label: 'Doğurganlık penceresi', description: 'Gebe kalma şansının en yüksek olduğu günlerdesiniz.' };
    }
    if (day === ovulationDay) {
      return { key: 'ovulation', label: 'Yumurtlama günü', description: 'Yumurta serbest bırakıldı ve 12-24 saat döllenebilir.' };
    }
    if (day <= cycleLength) {
      return { key: 'luteal', label: 'Luteal evre', description: 'Progesteron yükseldi. PMS belirtileri bu dönemde görülür.' };
    }
    return { key: 'late', label: 'Gecikme', description: 'Beklenen regl tarihinizi geçtiniz.' };
  }

  private estimateMonthlyChance(input: {
    variation: number;
    avgCycleLength: number;
    birthYear: number | null;
    heightCm: number | null;
    weightKg: number | null;
    healthConditions: string[];
    tryingDuration: string | null;
    cycleCount: number;
  }) {
    let chance = 25;
    const factors: Array<{ label: string; impact: string; detail: string }> = [];

    const age = input.birthYear ? new Date().getFullYear() - input.birthYear : null;
    if (age !== null) {
      if (age < 25) { chance += 5; factors.push({ label: `Yaş: ${age}`, impact: 'olumlu', detail: '25 yaş altında aylık gebe kalma şansı en yüksek seviyededir.' }); }
      else if (age < 30) { factors.push({ label: `Yaş: ${age}`, impact: 'nötr', detail: '25-30 yaş aralığı doğurganlık için verimli bir dönemdir.' }); }
      else if (age < 35) { chance -= 4; factors.push({ label: `Yaş: ${age}`, impact: 'hafif olumsuz', detail: '30 yaş sonrası aylık şans yavaşça azalmaya başlar.' }); }
      else if (age < 40) { chance -= 10; factors.push({ label: `Yaş: ${age}`, impact: 'olumsuz', detail: '35 yaş sonrası yumurta rezervi ve kalitesi belirgin azalır.' }); }
      else { chance -= 16; factors.push({ label: `Yaş: ${age}`, impact: 'olumsuz', detail: '40 yaş üstünde aylık gebe kalma şansı %5 civarındadır.' }); }
    } else {
      factors.push({ label: 'Yaş bilgisi yok', impact: 'bilinmiyor', detail: 'Profilinize doğum yılınızı eklerseniz tahmin çok daha isabetli olur.' });
    }

    if (input.variation >= 8) {
      chance -= 7;
      factors.push({ label: `Döngü sapması: ${input.variation} gün`, impact: 'olumsuz', detail: 'Düzensiz döngüler yumurtlama gününü tahmin etmeyi zorlaştırır.' });
    } else if (input.cycleCount >= 3) {
      chance += 3;
      factors.push({ label: `Döngü sapması: ${input.variation} gün`, impact: 'olumlu', detail: 'Düzenli döngüleriniz yumurtlamanın öngörülebilir olduğunu gösterir.' });
    }

    if (input.avgCycleLength < 21 || input.avgCycleLength > 35) {
      chance -= 6;
      factors.push({ label: `Döngü uzunluğu: ${input.avgCycleLength} gün`, impact: 'olumsuz', detail: 'Normal aralık 21-35 gündür; dışına çıkan döngüler hormonal değerlendirme gerektirebilir.' });
    }

    if (input.heightCm && input.weightKg) {
      const m = input.heightCm / 100;
      const bmi = Math.round((input.weightKg / (m * m)) * 10) / 10;
      if (bmi < 18.5) { chance -= 5; factors.push({ label: `BKİ: ${bmi}`, impact: 'olumsuz', detail: 'Düşük vücut yağ oranı yumurtlamayı durdurabilir.' }); }
      else if (bmi >= 30) { chance -= 8; factors.push({ label: `BKİ: ${bmi}`, impact: 'olumsuz', detail: 'Yüksek BKİ insülin direnci üzerinden yumurtlamayı etkileyebilir.' }); }
      else if (bmi >= 25) { chance -= 3; factors.push({ label: `BKİ: ${bmi}`, impact: 'hafif olumsuz', detail: '%5-10 kilo kaybı döngü düzenini iyileştirebilir.' }); }
      else { chance += 2; factors.push({ label: `BKİ: ${bmi}`, impact: 'olumlu', detail: 'Vücut kitle indeksiniz doğurganlık için ideal aralıkta.' }); }
    }

    for (const c of input.healthConditions) {
      if (c === 'pcos') { chance -= 8; factors.push({ label: 'PCOS', impact: 'olumsuz', detail: 'Polikistik over sendromu yumurtlama düzensizliğine yol açar.' }); }
      if (c === 'endometriosis') { chance -= 8; factors.push({ label: 'Endometriozis', impact: 'olumsuz', detail: 'Pelvik yapışıklıklar yumurta transferini zorlaştırabilir.' }); }
      if (c === 'thyroid') { chance -= 4; factors.push({ label: 'Tiroid', impact: 'olumsuz', detail: 'Tiroid dengesizliği döngüyü ve implantasyonu etkileyebilir.' }); }
    }

    if (input.tryingDuration === '12plus') {
      chance -= 6;
      factors.push({ label: '12+ ay deneme', impact: 'olumsuz', detail: 'Uzun deneme süresi altta yatan bir faktör olabileceğini düşündürür.' });
    }

    return { monthlyChance: Math.max(3, Math.min(35, Math.round(chance))), factors };
  }

  private buildTips(
    phase: { key: string },
    currentCycleDay: number,
    ovulationDay: number,
    symptoms: Array<{ type: string; date: Date }>,
  ) {
    const tips: Array<{ title: string; body: string }> = [];

    switch (phase.key) {
      case 'menstrual':
        tips.push({ title: 'Demir depolarınızı doldurun', body: 'Kanama sırasında demir kaybı olur. Kırmızı et, mercimek ve C vitamini ile birlikte alınan yeşil yapraklılar emilimi artırır.' });
        break;
      case 'follicular':
        tips.push({ title: 'Şimdi antrenman zamanı', body: 'Yükselen östrojen ile enerjiniz ve kas toparlanmanız en iyi seviyede. Yoğun egzersizleri bu evreye planlayın.' });
        break;
      case 'fertile':
        tips.push({ title: 'Gün aşırı ilişki planlayın', body: 'Sperm kalitesi gün aşırı ilişkide en yüksek düzeyde kalır. Her gün ilişki zorunlu değildir.' });
        tips.push({ title: 'Servikal akıntınızı gözlemleyin', body: 'Şeffaf, esnek ve yumurta akı kıvamındaki akıntı yumurtlamanın en güvenilir doğal işaretidir.' });
        break;
      case 'ovulation':
        tips.push({ title: 'Yumurta 12-24 saat canlı', body: 'Bugün ve dün gerçekleşen ilişki döllenme için en yüksek şansı taşır.' });
        break;
      case 'luteal':
        tips.push({ title: 'İki hafta bekleme dönemi', body: 'İmplantasyon yumurtlamadan 6-12 gün sonra gerçekleşir. Gebelik testini en erken beklenen regl gününde yapın.' });
        break;
      case 'late':
        tips.push({ title: 'Test için uygun zaman', body: 'Regliniz gecikti. Sabah ilk idrarla yapılan test en yüksek doğruluğu verir.' });
        break;
    }

    const recentTypes = new Set(symptoms.map(s => s.type.toLocaleLowerCase('tr-TR')));
    if (recentTypes.has('stres') || recentTypes.has('anksiyete')) {
      tips.push({ title: 'Stres yumurtlamayı geciktirebilir', body: 'Son kayıtlarınızda stres belirtisi var. Yüksek kortizol LH pikini erteleyerek yumurtlamayı geciktirebilir.' });
    }
    if (recentTypes.has('uykusuzluk')) {
      tips.push({ title: 'Uyku hormon dengesini etkiliyor', body: 'Kayıtlarınızda uykusuzluk görünüyor. 7 saatin altındaki uyku LH ve FSH salınımını bozabilir.' });
    }

    tips.push({ title: 'Folik asit', body: 'Gebelik planlıyorsanız günlük 400 mcg folik asidi gebe kalmadan en az 1 ay önce başlatın.' });

    return tips;
  }
}
