export type DailyTip = { title: string; content: string; module: string };

const PREGNANCY_TIPS: Array<{ from: number; to: number; content: string }> = [
  { from: 1, to: 4, content: 'Bu haftalar döllenme ve tutunma dönemidir. Folik asit (400 mcg) alın, alkol ve sigaradan uzak durun. Gebelik testi için biraz daha bekleyin.' },
  { from: 5, to: 8, content: 'Kalp atışı bu dönemde başlar. Sabah bulantısında az az, sık sık yiyin; boş mideyi tetiklemeyin. Şiddetli kusma varsa hekime danışın.' },
  { from: 9, to: 12, content: 'Organ taslakları oluşuyor. Çiğ et, pastörize edilmemiş süt ve yüksek cıvalı balıktan kaçının. İlk trimester tarama randevusunu planlayın.' },
  { from: 13, to: 16, content: 'Enerji biraz toparlanabilir. Bol su için; kabızlığı önlemek için lif alın. Yeni egzersize başlamadan hekiminize sorun.' },
  { from: 17, to: 20, content: 'Bebek hareketlerini hissetmeye başlayabilirsiniz. Uyumada yan yatış daha rahattır. Detaylı ultrason haftalarını kaçırmayın.' },
  { from: 21, to: 24, content: 'Bacak krampları sıklaşabilir; magnezyum zengin besinler ve baldır esnetmesi işe yarar. Şiddetli baş ağrısı veya görme bulanıklığında hemen başvurun.' },
  { from: 25, to: 28, content: 'Şeker yükleme testi bu dönemde yapılır. Öğün atlamayın; baş dönmesi olursa oturun ve su için.' },
  { from: 29, to: 32, content: 'Nefes darlığı ve şişlik artabilir. Sırtüstü uzun yatmayın. Bebek hareketlerinde ani azalma olursa beklemeyin.' },
  { from: 33, to: 36, content: 'Hastane çantasını hazırlayın. Braxton Hicks kasılmaları kısa ve düzensizdir; düzenli ve güçlenen ağrıda arayın.' },
  { from: 37, to: 42, content: 'Doğum yaklaşırken dinlenin, küçük yürüyüşler yeter. Su gelmesi, düzenli kasılma veya kanama olursa hemen hastaneye gidin.' },
];

const PERIOD_TIPS: Record<string, string[]> = {
  menstrual: [
    'Kanama günlerinde demir kaybı olur. Mercimek, kırmızı et veya ıspanağı C vitamini (narenciye, kivi) ile birlikte alın.',
    'Sıcak kompres ve hafif yürüyüş krampları azaltabilir. Ağrı kesici kullanacaksanız hekiminizin önerdiği dozu aşmayın.',
  ],
  follicular: [
    'Regl bittikten sonra yükselen östrojenle enerji artar. Bu evre yeni bir alışkanlık veya antrenman için daha uygundur.',
    'Uyku ve protein, hormon dengesini destekler. Kafeini öğleden sonra kesmek uykuya yardımcı olur.',
  ],
  fertile: [
    'Doğurgan pencerede servikal akıntı genelde şeffaf ve esnek olur. Gebe kalmayı planlıyorsanız gün aşırı birliktelik yeterlidir.',
    'Yumurtlama günü herkes için aynı değildir; döngü uzunluğunuza göre pencere kayar. Takvimi tek başına yöntem saymayın.',
  ],
  ovulation: [
    'Yumurta yaklaşık 12–24 saat canlı kalır. Bugün veya dün gerçekleşen birliktelik en yüksek şansı taşır.',
    'Tek taraflı hafif kasık ağrısı (mittelschmerz) yumurtlamada sık görülür; şiddetli ve sürekli ağrıda hekime görünün.',
  ],
  luteal: [
    'Yumurtlamadan sonra progesteron yükselir; şişkinlik ve yorgunluk normal olabilir. Yoğun kardiyo yerine yürüyüş tercih edin.',
    'Gebelik testi için beklenen regl gününü bekleyin. Erken test yanlış negatif verebilir.',
  ],
};

const WELLNESS = [
  'Günde 1.5–2 litre su, baş ağrısı ve yorgunluğu azaltır; çayı suyun yerine saymayın.',
  '7–9 saat uyku, hormon ve ruh hali için egzersiz kadar önemlidir.',
  'Ekranı yatmadan 45 dakika önce bırakmak uykuya dalmayı kolaylaştırır.',
  'Tuzlu atıştırmalık yerine yoğurt, meyve veya bir avuç kuruyemiş daha uzun tok tutar.',
  'Günde 20–30 dakikalık yürüyüş kan dolaşımını ve ruh halini destekler.',
  'Partnerinize kısa bir teşekkür mesajı, günün stresini ikiniz için de yumuşatır.',
];

function cyclePhase(currentCycleDay: number, cycleLength: number, periodLength: number): keyof typeof PERIOD_TIPS {
  const ovDay = Math.max(8, cycleLength - 14);
  if (currentCycleDay <= periodLength) return 'menstrual';
  if (currentCycleDay === ovDay) return 'ovulation';
  if (currentCycleDay >= ovDay - 5 && currentCycleDay <= ovDay + 1) return 'fertile';
  if (currentCycleDay < ovDay) return 'follicular';
  return 'luteal';
}

function pickFrom(list: string[], salt: number): string {
  return list[Math.abs(salt) % list.length];
}

export function buildDailyTip(input: {
  pregnancyWeek?: number | null;
  currentCycleDay?: number | null;
  cycleLength?: number | null;
  periodLength?: number | null;
  hasRelationship?: boolean;
}): DailyTip {
  const day = new Date().getDate() + new Date().getMonth() * 31;

  if (input.pregnancyWeek && input.pregnancyWeek >= 1) {
    const week = Math.min(42, input.pregnancyWeek);
    const row = PREGNANCY_TIPS.find((t) => week >= t.from && week <= t.to) ?? PREGNANCY_TIPS[0];
    return { title: `${week}. hafta ipucu`, content: row.content, module: 'pregnancy' };
  }

  if (input.currentCycleDay && input.cycleLength && input.periodLength) {
    const phase = cyclePhase(input.currentCycleDay, input.cycleLength, input.periodLength);
    return {
      title: 'Günün sağlık ipucu',
      content: pickFrom(PERIOD_TIPS[phase], day),
      module: 'period',
    };
  }

  if (input.hasRelationship) {
    return {
      title: 'Günün ipucu',
      content: pickFrom(
        ['Bugün ona nasıl hissettiğinizi bir cümleyle yazın.', 'Ortak bir 10 dakikalık yürüyüş, uzun bir tartışmadan daha iyi gelir.', ...WELLNESS],
        day,
      ),
      module: 'relationship',
    };
  }

  return { title: 'Günün sağlık ipucu', content: pickFrom(WELLNESS, day), module: 'wellness' };
}
