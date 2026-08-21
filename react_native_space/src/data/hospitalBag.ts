export type BagCategory = 'mom' | 'baby' | 'partner';
export type BirthPlan = 'vaginal' | 'csection' | 'unknown';

export interface BagItem {
  id: string;
  title: string;
  category: BagCategory;
  completed: boolean;
  hint?: string;
  custom?: boolean;
}

export interface BagContext {
  week: number | null;
  dueMonth: number | null;
  babySex: 'girl' | 'boy' | 'unknown';
  hasPartner: boolean;
  birthPlan: BirthPlan;
}

function seasonOf(month: number | null): 'winter' | 'summer' | 'mild' {
  if (month == null) return 'mild';
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'mild';
}

export function buildSuggestedBag(ctx: BagContext): BagItem[] {
  const items: BagItem[] = [
    { id: 'm1', title: 'Kimlik, SGK/sağlık kartı ve gebelik takip dosyası', category: 'mom', completed: false, hint: 'Son ultrason ve tahliller' },
    { id: 'm2', title: 'Önden açılan 2 gecelik / emzirme dostu pijama', category: 'mom', completed: false },
    { id: 'm3', title: 'Emzirme sütyeni ve göğüs pedi', category: 'mom', completed: false },
    { id: 'm4', title: 'Lohusa terliği ve kalın çorap', category: 'mom', completed: false },
    { id: 'm5', title: 'Doğum sonrası lohusa pedi (büyük boy)', category: 'mom', completed: false },
    { id: 'm6', title: 'Göğüs ucu bakımı (lanolin veya hekimin önerdiği krem)', category: 'mom', completed: false },
    { id: 'm7', title: 'Kişisel bakım (diş, tarak, dudak nemlendirici, saç tokası)', category: 'mom', completed: false },
    { id: 'm8', title: 'Hastaneden çıkış kıyafeti (rahat, bir beden büyük)', category: 'mom', completed: false },
    { id: 'm9', title: 'Telefon şarjı, powerbank ve kulaklık', category: 'mom', completed: false },
    { id: 'm10', title: 'Atıştırmalık, su ve dudak nemlendirici (travay uzun sürebilir)', category: 'mom', completed: false },
    { id: 'm11', title: 'Gözlük / lens kabı (varsa)', category: 'mom', completed: false },
    { id: 'm12', title: 'Pusena sağlık PDF özeti (doktor için)', category: 'mom', completed: false, hint: 'Profil → Doktor raporu' },

    { id: 'b1', title: 'Yenidoğan çıkış seti (zıbın, tulum, şapka, eldiven)', category: 'baby', completed: false },
    { id: 'b2', title: 'Yenidoğan bebek bezi (en az 1 paket)', category: 'baby', completed: false },
    { id: 'b3', title: 'Müslin bez ve ağız mendili (4–6 adet)', category: 'baby', completed: false },
    { id: 'b4', title: 'Mevsime uygun bebek battaniyesi', category: 'baby', completed: false },
    { id: 'b5', title: 'Pişik kremi ve ıslak pamuk / hassas mendil', category: 'baby', completed: false },
    { id: 'b6', title: 'Oto koltuğu (eve dönüş, arkaya bakan)', category: 'baby', completed: false },
    { id: 'b7', title: 'Emzik (isterseniz, steril kutu)', category: 'baby', completed: false },
  ];

  if (ctx.babySex === 'girl') {
    items.push({ id: 'b-g', title: 'Kız bebek: yedek body ve ince şapka (pembe/nötr)', category: 'baby', completed: false });
  } else if (ctx.babySex === 'boy') {
    items.push({ id: 'b-b', title: 'Erkek bebek: yedek body ve ince şapka (mavi/nötr)', category: 'baby', completed: false });
  }

  const season = seasonOf(ctx.dueMonth);
  if (season === 'winter') {
    items.push(
      { id: 'm-w', title: 'Kalın hırka / yün çorap (hastane odaları serin olabilir)', category: 'mom', completed: false },
      { id: 'b-w', title: 'Kalın tulum ve yedek bere (kış çıkışı)', category: 'baby', completed: false },
    );
  }
  if (season === 'summer') {
    items.push(
      { id: 'm-s', title: 'İnce pamuklu gecelik ve ter emici havlu', category: 'mom', completed: false },
      { id: 'b-s', title: 'İnce müslin kundak, güneşlik (araç için)', category: 'baby', completed: false },
    );
  }

  if (ctx.birthPlan === 'csection') {
    items.push(
      { id: 'm-cs1', title: 'Yüksek bel, dikiş üstüne basmayan külot (bol)', category: 'mom', completed: false },
      { id: 'm-cs2', title: 'Karın destek bandı (hekiminiz önerirse)', category: 'mom', completed: false },
      { id: 'm-cs3', title: 'Önden açılan hırka (eğilmeden giyilir)', category: 'mom', completed: false },
      { id: 'm-cs4', title: 'Ek yastık / bel desteği (yatakta kalkış)', category: 'mom', completed: false },
    );
  } else if (ctx.birthPlan === 'vaginal') {
    items.push(
      { id: 'm-v1', title: 'Sprey şişe / perine bakımı için hekimin önerdiği ürün', category: 'mom', completed: false },
      { id: 'm-v2', title: 'Emzirme yastığı veya sıkı rulo havlu', category: 'mom', completed: false },
    );
  }

  if ((ctx.week ?? 0) >= 34) {
    items.push({ id: 'm-late', title: 'Çanta kapıda dursun: araba koltuğu takılı, yol tarifi kayıtlı', category: 'mom', completed: false });
  }

  if (ctx.hasPartner) {
    items.push(
      { id: 'p1', title: 'Partner: yedek kıyafet, terlik ve diş fırçası', category: 'partner', completed: false },
      { id: 'p2', title: 'Partner: şarj aleti, powerbank, nakit/kart', category: 'partner', completed: false },
      { id: 'p3', title: 'Partner: sizin ve kendisi için su / atıştırmalık', category: 'partner', completed: false },
      { id: 'p4', title: 'Partner: bebek oto koltuğu montajını önceden denesin', category: 'partner', completed: false },
      { id: 'p5', title: 'Partner: doğum planınızın kısa notu (istekler, alerjiler)', category: 'partner', completed: false },
    );
  }

  return items;
}

export function mergeBag(saved: BagItem[], suggested: BagItem[]): BagItem[] {
  const byId = new Map(saved.map((i) => [i.id, i]));
  const merged: BagItem[] = suggested.map((s) => {
    const prev = byId.get(s.id);
    return prev ? { ...s, completed: prev.completed, title: prev.custom ? prev.title : s.title } : s;
  });
  for (const extra of saved) {
    if (!merged.some((m) => m.id === extra.id)) merged.push(extra);
  }
  return merged;
}

export function bagStageCopy(week: number | null) {
  if (week == null) return 'Gebelik haftanız kayıtlara geçince liste kişiselleşir.';
  if (week < 28) return `${week}. haftadasınız. Çantayı 32–34. haftaya kadar doldurmanız önerilir.`;
  if (week < 34) return `${week}. hafta — üçüncü trimester. Çantayı bu haftalarda tamamlayın.`;
  return `${week}. hafta — çanta hazır ve kapının yanında olsun.`;
}
