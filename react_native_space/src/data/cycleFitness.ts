export type FitnessPhaseId = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'pregnancy' | 'postpartum';

export interface WorkoutItem {
  name: string;
  minutes: string;
  how: string;
}

export interface FitnessPhase {
  id: FitnessPhaseId;
  title: string;
  dayHint: string;
  intensity: string;
  energy: string;
  hormone: string;
  workouts: WorkoutItem[];
  avoid: string[];
  nutrition: string;
}

export const FITNESS_PHASES: FitnessPhase[] = [
  {
    id: 'menstrual',
    title: 'Menstrüel evre (regl)',
    dayHint: 'Döngü günü 1 — regl bitene kadar (kendi periodLength değeriniz)',
    intensity: 'Düşük',
    energy: 'İçe dönük, toparlanma',
    hormone: 'Östrojen ve progesteron dipte. Prostaglandinler kramp yapabilir; yoğun HIIT kortizolü yükseltir.',
    workouts: [
      { name: 'Yin / restoratif yoga', minutes: '20–30 dk', how: 'Kalça açıcı, öne eğilmeler yumuşak. Baş aşağı duruşları ağır krampte atlayın.' },
      { name: 'Düz yürüyüş', minutes: '15–25 dk', how: 'Konuşma temposu. Ağrı 7/10 üzerindeyse yürüyüşü kesin, ısıtıcı uygulayın.' },
      { name: 'Pelvik nefes + hafif Kegel', minutes: '8 dk', how: '4 saniye nefes al, 6 saniye ver. Kegel: 5 sn kas, 10 sn bırak, 8 tekrar. Ağrılı günlerde sadece nefes.' },
      { name: 'Mobilite / kedi-deve', minutes: '10 dk', how: 'Omurga akışı, omuz daireleri. Karın crunch yok.' },
    ],
    avoid: ['Ağır deadlift / HIIT', 'Soğuk uzun açık su yüzüşü (krampı artırabilir)', 'Yeni PR denemesi'],
    nutrition: 'Demir: kırmızı et veya mercimek + C vitamini. Sıvı ve magnezyum (badem, muz) krampa yardımcı olabilir.',
  },
  {
    id: 'follicular',
    title: 'Foliküler evre',
    dayHint: 'Regl bitiminden yumurtlamaya ~2–3 gün kala',
    intensity: 'Orta → yüksek',
    energy: 'Odak ve dayanıklılık artar',
    hormone: 'Östrojen yükselir; insülin duyarlılığı genelde iyidir. Kuvvet ve tempo eklenebilir.',
    workouts: [
      { name: 'Tempo yürüyüş / hafif koşu', minutes: '25–40 dk', how: 'Konuşabilirsiniz ama şarkı söylemek zor. Diz ağrısında koşu yerine yürüyüş.' },
      { name: 'Kuvvet (tüm vücut)', minutes: '30–40 dk', how: 'Squat, row, push, glute bridge. 3x8–12, son 2 tekrar zor ama form bozulmasın.' },
      { name: 'Pilates mat', minutes: '25 dk', how: 'Core ve kalça. Neck strain olmaması için başı yerde tutan varyasyonlar.' },
      { name: 'Dans / Zumba tarzı', minutes: '20–30 dk', how: 'Kalp atışını yükseltir, eklem dostu seçin.' },
      { name: 'Mobility + kalça', minutes: '10 dk', how: 'Antrenman sonrası 90/90 oturuş, kedi-deve.' },
    ],
    avoid: ['Uykusuzken max HIIT (kortizol)'],
    nutrition: 'Kompleks karbonhidrat (yulaf, meyve) antrenmanı taşır. Protein her öğünde avuç içi kadar.',
  },
  {
    id: 'ovulation',
    title: 'Yumurtlama penceresi',
    dayHint: 'Döngü uzunluğu − 14 gün civarı (kendi ortalamanız)',
    intensity: 'Yüksek ama eklem dikkatli',
    energy: 'Güç hissi zirvede olabilir',
    hormone: 'LH ve östrojen zirve; relaksin benzeri gevşeme bağları biraz laks yapabilir — ani yön değişiminde dikkat.',
    workouts: [
      { name: 'Kuvvet, kontrollü ağırlık', minutes: '35–45 dk', how: '5x5 squat/hip hinge yerine 3x6–8 kaliteli tekrar. Diz valgus yok.' },
      { name: 'Kısa aralıklı (HIIT light)', minutes: '12–16 dk', how: '40 sn iş / 20 sn dinlen x 8, bisiklet veya düz sprint yoksa merdiven.' },
      { name: 'Üst vücut + core', minutes: '25 dk', how: 'Row, overhead press hafif, dead bug. Bel ağrısında press’i oturarak yapın.' },
      { name: 'Germe / yoga akışı', minutes: '15 dk', how: 'Antrenman sonrası, zorlayıcı split yok.' },
    ],
    avoid: ['Plyometrik (kutu zıplama) soğukken', 'Aşırı gerdirme (relaksin etkisi)'],
    nutrition: 'Lifli sebze ve su. Bu günlerde şişkinlik olursa gaz yapan kuruyemişi antrenman sonrasına alın.',
  },
  {
    id: 'luteal',
    title: 'Luteal evre (PMS’e doğru)',
    dayHint: 'Yumurtlama sonrası → sonraki regl',
    intensity: 'Orta, hacim düşür',
    energy: 'Isı ve metabolizma biraz artar; toparlanma yavaşlar',
    hormone: 'Progesteron baskın. Kalp atışı istirahatte 2–5 atım yükselebilir; aynı koşu daha zor gelebilir — bu normaldir.',
    workouts: [
      { name: 'Mat pilates / kontrollü kuvvet', minutes: '25–35 dk', how: 'Ağırlığı %10–20 düşürün, tekrar 10–12. Set arası nefes.' },
      { name: 'Doğa yürüyüşü', minutes: '30–45 dk', how: 'Düz veya hafif yokuş. PMS günü 20 dk yeter.' },
      { name: 'Yüzme veya su yürüyüşü', minutes: '20–30 dk', how: 'Eklem yükü düşük. Havuz hijyeni kişisel tercih.' },
      { name: 'Yin yoga + kalça', minutes: '20 dk', how: 'PMS krampında karın üzerine baskısız pozisyonlar.' },
      { name: 'Hafif direnç lastiği', minutes: '15 dk', how: 'Glute med, row. HIIT yok.' },
    ],
    avoid: ['Yeni 1RM', 'Uzun açlık + ağır antrenman', 'Uykusuz gece sonrası HIIT'],
    nutrition: 'Tuz ve kafein PMS şişkinliğini artırabilir. Magnezyum, kompleks karb, düzenli öğün kan şekerini tutar.',
  },
  {
    id: 'pregnancy',
    title: 'Aktif gebelik',
    dayHint: 'Gebelik kaydınızdaki haftaya göre',
    intensity: 'Düşük–orta, konuşma temposu',
    energy: 'Trimestere göre değişir',
    hormone: 'Relaksin bağları gevşetir. Sırtüstü 2. trimesterden sonra uzun süre yatmayın. Karın kası “crunch” ve temas sporları yok.',
    workouts: [
      { name: 'Prenatal yoga', minutes: '20–30 dk', how: 'Özel sınıf veya sırtüstü olmayan akış. Nefesle pelvik taban.' },
      { name: 'Yürüyüş', minutes: '20–40 dk', how: 'Düz zemin, su matarası. Kanama, baş dönmesi, tekmelerde azalma olursa durun ve hekimi arayın.' },
      { name: 'Duvar squat / glute bridge (hekim onaylı)', minutes: '10–15 dk', how: '2. trimesterde bridge kısa tutulur. Nefes tutmayın (Valsalva yok).' },
      { name: 'Kegel (onaylıysa)', minutes: '5 dk', how: '5 sn kas 10 sn bırak. İdrar akışını keserek pratik yapmayın.' },
    ],
    avoid: ['Sıcak yoga', 'Temas / düşme riski', 'Sırtüstü uzun plank/crunch 20. haftadan sonra', 'Max ağırlık'],
    nutrition: 'Antrenman öncesi küçük atıştırmalık. Overheating yok. Folat ve demir takviyesi hekim dozunda.',
  },
  {
    id: 'postpartum',
    title: 'Doğum sonrası (6 haftaya kadar)',
    dayHint: 'Hekim 6. hafta muayenesine kadar',
    intensity: 'Çok düşük',
    energy: 'İyileşme öncelikli',
    hormone: 'Rahim involüsyon, löşi, dikiş. Emzirme oksitosinle kramp yapabilir — bu beklenen bir toparlanmadır.',
    workouts: [
      { name: 'Nefes ve yürüyüş (izinle)', minutes: '5–15 dk', how: 'Sezaryen/normal doğum farkı hekim talimatına bağlı. Kanama artarsa durun.' },
      { name: 'Nazik Kegel (onay sonrası)', minutes: '5 dk', how: 'Ağrısız kasma. Ağrı varsa pelvik fizyoterapist.' },
      { name: 'Omuz / sırt germe (emzirme postürü)', minutes: '8 dk', how: 'Kapı eşiği göğüs açma, çene hafif çekik.' },
    ],
    avoid: ['Koşu, zıplama, ağır mekik, 6. haftadan önce spor salonu programı'],
    nutrition: 'Emziriyorsanız ek 400–500 kcal ve sıvı. Demir kaybı doğum kanamasına göre hekimle.',
  },
];

export function resolvePhase(opts: {
  isPregnant: boolean;
  isPostpartum: boolean;
  cycleDay: number | null;
  periodLength: number;
  cycleLength: number;
}): FitnessPhaseId {
  if (opts.isPostpartum) return 'postpartum';
  if (opts.isPregnant) return 'pregnancy';
  if (opts.cycleDay == null) return 'follicular';
  const d = opts.cycleDay;
  const p = Math.max(2, opts.periodLength);
  const c = Math.max(21, opts.cycleLength);
  const ov = c - 14;
  if (d <= p) return 'menstrual';
  if (d >= ov - 1 && d <= ov + 1) return 'ovulation';
  if (d < ov - 1) return 'follicular';
  return 'luteal';
}
