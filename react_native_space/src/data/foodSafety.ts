export type FoodStatus = 'safe' | 'caution' | 'danger';
export type LifeStage = 'pregnancy_t1' | 'pregnancy_t2' | 'pregnancy_t3' | 'postpartum' | 'ttc' | 'cycle';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  /** Base status in pregnancy (most restrictive). */
  pregnancy: FoodStatus;
  postpartum: FoodStatus;
  ttc: FoodStatus;
  cycle: FoodStatus;
  reason: string;
  stageNote?: Partial<Record<LifeStage, string>>;
}

export const FOOD_SAFETY_CATALOG: FoodItem[] = [
  { id: 'pasteurized-dairy', name: 'Pastörize süt, yoğurt, kaşar', category: 'Süt', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Pastörize ürünlerde listeria riski yoktur; kalsiyum ve protein sağlar.' },
  { id: 'raw-milk', name: 'Çiğ süt, pastörize edilmemiş peynir (brie, tulum açık tezgâh)', category: 'Süt', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Listeria monocytogenes düşük doğum ağırlığı, erken doğum ve düşüğe yol açabilir.', stageNote: { postpartum: 'Emzirirken de hijyen önemli; pastörize tercih edin.', ttc: 'Gebe kalmadan pastörize alışkanlığı kazanın.' } },
  { id: 'raw-meat', name: 'Çiğ köfte, az pişmiş kırmızı et, çiğ yumurta', category: 'Et', pregnancy: 'danger', postpartum: 'caution', ttc: 'danger', cycle: 'caution', reason: 'Toksoplazma, Salmonella ve E. coli riski. Etler tam pişmeli (iç ısısı ≥71°C).', stageNote: { ttc: 'Toksoplazma bağışıklığı gebelikten önce de önemlidir.' } },
  { id: 'deli-cold', name: 'Soğuk sosis, salam, sucuk (pişirilmeden)', category: 'Et', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Listeria soğuk şarküteride üreyebilir. Yenilecekse kızartılıncaya kadar pişirin.' },
  { id: 'liver', name: 'Karaciğer (sık / büyük porsiyon)', category: 'Et', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'A vitamini (retinol) fazlası gebelikte teratojen olabilir. Nadir küçük porsiyon hekim onayıyla.', stageNote: { pregnancy_t1: 'İlk trimesterde retinol özellikle sakıncalıdır.' } },
  { id: 'cooked-salmon', name: 'İyi pişmiş somon, hamsi, istavrit', category: 'Balık', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Düşük cıva, DHA/EPA fetus ve süt yapan annenin beyin gelişimini destekler. Haftada 2 porsiyon.' },
  { id: 'high-mercury', name: 'Kılıç, köpekbalığı, büyük ton (steak), kral uskumru', category: 'Balık', pregnancy: 'danger', postpartum: 'danger', ttc: 'danger', cycle: 'caution', reason: 'Metilcıva fetus ve süt çocuğu sinir sistemine geçer. Küçük yağlı balık tercih edin.' },
  { id: 'raw-seafood', name: 'Çiğ suşi, midye, istridye, çiğ karides', category: 'Balık', pregnancy: 'danger', postpartum: 'caution', ttc: 'danger', cycle: 'caution', reason: 'Norovirüs, hepatit A, parazit ve ağır metal riski. Sushi yerine pişmiş rulo seçin.' },
  { id: 'caffeine', name: 'Kahve, siyah çay, enerji içeceği', category: 'İçecek', pregnancy: 'caution', postpartum: 'caution', ttc: 'caution', cycle: 'safe', reason: 'Gebelikte kafein ≤200 mg/gün (yaklaşık 1 küçük filtre kahve). Fazlası düşük doğum ağırlığıyla ilişkilidir.', stageNote: { pregnancy_t1: 'İlk 12 haftada 200 mg sınırına özellikle uyun.', postpartum: 'Emzirirken 200–300 mg genelde uyumludur; bebeğin huzursuzluğunu izleyin.', cycle: 'Döngüde kafein kısıtı yoktur; PMS’de azaltmak uykuya yardımcı olabilir.' } },
  { id: 'alcohol', name: 'Alkol (bira, şarap, rakı dahil her miktar)', category: 'İçecek', pregnancy: 'danger', postpartum: 'caution', ttc: 'danger', cycle: 'caution', reason: 'Güvenli doz yoktur; fetal alkol spektrumu riski. TTC döneminde de bırakılması önerilir.', stageNote: { postpartum: 'Emzirirken alkol süte geçer. İçildiyse 2–3 saat bekleyip sağarak atmak “temizlemez”; zaman gerekir.' } },
  { id: 'sage-tea', name: 'Adaçayı, kekik yağı, sinameki, rezene yağı (yoğun)', category: 'Bitki', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Uterus uyarıcı veya yetersiz güvenlik verisi. “Doğal” = güvenli demek değildir.', stageNote: { postpartum: 'Süt artırıcı diye satılan yağlar karaciğer toksik olabilir; gıda olarak rezene çayı sınırlı tüketilir.' } },
  { id: 'linden', name: 'Ihlamur, papatya (günde 1–2 fincan)', category: 'Bitki', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Geleneksel olarak düşük dozda kullanılır; ilaç gibi “kür” yapılmaz.' },
  { id: 'avocado', name: 'Avokado, ceviz, keten tohumu (öğütülmüş)', category: 'Yağlı tohum', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Folat, sağlıklı yağ ve lif. Folat nöral tüp için TTC ve T1’de kritiktir.' },
  { id: 'leafy-greens', name: 'İyi yıkanmış yeşil yapraklılar, narenciye', category: 'Sebze-meyve', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Folat ve C vitamini. Topraklı yeşillik toksoplazma için iyice yıkanmalı.' },
  { id: 'unwashed-veg', name: 'Yıkanmamış salata, sokak turşusu açık tezgâh', category: 'Sebze-meyve', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Toksoplazma oocystleri ve listeria. Evde akan su + ovalayarak yıkayın.' },
  { id: 'pate', name: 'Karaciğer ezmesi, açık büfe mezeler (oda ısısında bekleyen)', category: 'Hazır', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Listeria soğuk et ezmesinde üreyebilir. Taze pişmiş, sıcak yemek tercih edin.' },
  { id: 'honey', name: 'Bal (anne için)', category: 'Tatlı', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Anne için güvenli. 1 yaş altı bebeğe bal verilmez (botulizm).', stageNote: { postpartum: 'Bebeğin kaşığına / emziğe bal sürmeyin.' } },
  { id: 'soft-cheese-pasteurized', name: 'Pastörize labne, süzme peynir (kapalı ambalaj)', category: 'Süt', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Etikette “pastörize” yazıyorsa yumuşak peynir de kabul edilir.' },
  { id: 'energy-drink', name: 'Enerji içeceği, yüksek kafein shot', category: 'İçecek', pregnancy: 'danger', postpartum: 'danger', ttc: 'danger', cycle: 'caution', reason: 'Kafein + diğer uyarıcılar 200 mg sınırını kolay aşar; içerik belirsizdir.' },
  { id: 'herbal-slimming', name: 'Zayıflama çayı, detoks kürü, yüksek doz C vitamini (>1 g)', category: 'Takviye', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Standartsız karışımlar rahim kasılması ve karaciğer hasarı bildirilmiştir. Takviye hekim onaylı olsun.' },
  { id: 'fish-oil', name: 'Hekim onaylı DHA / balık yağı', category: 'Takviye', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Cıva arındırılmış preparatlar T2–T3 ve emzirmede sık önerilir. Kendi başınıza megadoz almayın.' },
  { id: 'folic-acid', name: 'Folik asit 400–800 mcg (hekim dozu)', category: 'Takviye', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Nöral tüp kapanması son adetten sonraki ilk 28 günde olur; TTC’de 1 ay önce başlanır.', stageNote: { cycle: 'Gebe kalmayı planlamıyorsanız rutin yüksek doz gerekmez.', ttc: 'En az 1 ay önce başlayın.' } },
  { id: 'undercooked-eggs', name: 'Rafadan yumurta, tiramisu, ev mayonezi', category: 'Yumurta', pregnancy: 'danger', postpartum: 'caution', ttc: 'caution', cycle: 'caution', reason: 'Salmonella. Yumurta katı pişsin.' },
  { id: 'water', name: 'Güvenli içme suyu, günde 2–3 L', category: 'İçecek', pregnancy: 'safe', postpartum: 'safe', ttc: 'safe', cycle: 'safe', reason: 'Amniyon ve süt üretimi için sıvı şart. Musluk suyu şehrinize göre; şüphede damacana/filtre.', stageNote: { postpartum: 'Emzirirken her seans sonrası 1 bardak su pratik hedeftir.' } },
];

export function resolveFood(item: FoodItem, stage: LifeStage): { status: FoodStatus; reason: string } {
  const status =
    stage.startsWith('pregnancy') ? item.pregnancy :
    stage === 'postpartum' ? item.postpartum :
    stage === 'ttc' ? item.ttc :
    item.cycle;
  const extra = item.stageNote?.[stage];
  return { status, reason: extra ? `${item.reason} ${extra}` : item.reason };
}

export function describeStage(stage: LifeStage): { title: string; subtitle: string } {
  switch (stage) {
    case 'pregnancy_t1':
      return { title: 'Gebelik 1. trimester', subtitle: 'Listeria, toksoplazma, alkol ve yüksek A vitamini bu dönemde en kritik kısıtlardır. Folat devam eder.' };
    case 'pregnancy_t2':
      return { title: 'Gebelik 2. trimester', subtitle: 'Aynı gıda hijyeni sürer. DHA’lı balık (pişmiş, düşük cıva) ve demir ihtiyacı artar.' };
    case 'pregnancy_t3':
      return { title: 'Gebelik 3. trimester', subtitle: 'Listeria hâlâ düşük/preterm riskidir. Kafein 200 mg, çiğ deniz ürünü yok.' };
    case 'postpartum':
      return { title: 'Lohusalık / emzirme', subtitle: 'Alkol ve yüksek cıvalı balık süte geçer. Anne için bal güvenli; 1 yaş altı bebeğe bal yok.' };
    case 'ttc':
      return { title: 'Gebe kalmayı deniyorsunuz', subtitle: 'Folik asit, alkolü bırakmak ve pastörize/pişmiş gıda alışkanlığı gebelikten önce başlar.' };
    default:
      return { title: 'Döngü takibi', subtitle: 'Gebelik kısıtları uygulanmaz. Hijyen ve dengeli beslenme geçerlidir; sahte “yasak listesi” yok.' };
  }
}
