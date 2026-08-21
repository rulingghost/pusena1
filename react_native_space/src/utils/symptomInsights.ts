export interface SymptomInsight {
  title: string;
  explanation: string;
  tip?: string;
}

const INSIGHT_MAP: Record<string, SymptomInsight> = {
  'Baş ağrısı': {
    title: 'Baş Ağrısı',
    explanation: 'Regl öncesi östrojen düşüşü ve prostaglandin artışı damarlarda genişlemeye yol açarak baş ağrısı yapabilir. Stres ve uyku eksikliği bunu artırır.',
    tip: 'Bol su için, kafeini azaltın ve düzenli uyku saatlerine dikkat edin.',
  },
  'Karın ağrısı': {
    title: 'Karın Ağrısı',
    explanation: 'Rahim kasılmaları ve prostaglandin salınımı regl döneminde karın alt bölgesinde kramp ve ağrıya neden olur. Bu çoğu zaman normal bir döngü belirtisidir.',
    tip: 'Sıcak kompres ve hafif yürüyüş kas gevşemesine yardımcı olabilir.',
  },
  'Bel ağrısı': {
    title: 'Bel Ağrısı',
    explanation: 'Rahim kasılmaları pelvik bölgeye yayılarak bel ağrısı oluşturabilir. Progesteron artışı bağ dokularını gevşeterek hassasiyeti artırır.',
    tip: 'Yan yatış ve hafif esneme hareketleri rahatlatabilir.',
  },
  'Göğüs hassasiyeti': {
    title: 'Göğüs Hassasiyeti',
    explanation: 'Luteal evrede progesteron yükselir; bu da göğüs dokusunda şişkinlik ve hassasiyet yaratır. Regl başlayınca genellikle hafifler.',
    tip: 'Destekleyici sütyen kullanın; kafein tüketimini azaltmayı deneyin.',
  },
  'Sinirlilik': {
    title: 'Sinirlilik',
    explanation: 'Progesteron ve östrojen dalgalanmaları beyindeki serotonin düzeyini etkileyerek PMS döneminde sinirlilik ve gerginlik yaratabilir.',
    tip: 'Nefes egzersizi, kısa yürüyüşler ve magnezyum açısından zengin besinler faydalı olabilir.',
  },
  'Üzgünlük': {
    title: 'Üzgünlük',
    explanation: 'Hormon düşüşü özellikle regl öncesi dönemde duygusal dalgalanmalara ve halsizlik hissine yol açabilir. Bu geçici bir döngü belirtisi olabilir.',
    tip: 'Günlük rutininizi koruyun; yoğun duygular 2-3 günden uzun sürerse destek almayı düşünün.',
  },
  'Kaygı': {
    title: 'Kaygı',
    explanation: 'Östrojen düşüşü GABA ve serotonin aktivitesini azaltarak kaygı hissini artırabilir. Döngünün luteal evresinde daha sık görülür.',
    tip: 'Kafeini sınırlayın, düzenli uyuyun ve gün içinde kısa molalar verin.',
  },
  'Mutluluk': {
    title: 'Mutluluk',
    explanation: 'Foliküler ve ovülasyon evresinde östrojen yükselişi dopamin ve serotonin düzeylerini destekleyerek enerji ve iyi hissetme halini artırır.',
    tip: 'Bu dönemi yaratıcı işler ve sosyal aktiviteler için iyi bir zaman olarak değerlendirebilirsiniz.',
  },
  'Şişkinlik': {
    title: 'Şişkinlik',
    explanation: 'Progesteron sindirim hızını yavaşlatır ve su tutulumuna neden olabilir. Regl öncesi dönemde şişkinlik çok yaygındır.',
    tip: 'Tuz alımını azaltın, lifli gıdalar tüketin ve hareketi artırın.',
  },
  'Yorgunluk': {
    title: 'Yorgunluk',
    explanation: 'Progesteron vücut sıcaklığını artırır ve enerji seviyesini düşürebilir. Demir kaybı regl döneminde yorgunluğu şiddetlendirebilir.',
    tip: 'Demir açısından zengin besinler ve kısa uyku molaları yardımcı olabilir.',
  },
  'Mide bulantısı': {
    title: 'Mide Bulantısı',
    explanation: 'Prostaglandinler sindirim sistemini uyararak bulantıya yol açabilir. Regl veya ovülasyon döneminde görülebilir.',
    tip: 'Az ve sık öğünler, zencefil çayı ve yağlı yiyeceklerden kaçınma rahatlatabilir.',
  },
  'Akne': {
    title: 'Akne',
    explanation: 'Androjen hormonları regl öncesi dönemde artarak yağ bezlerini uyarır ve sivilce oluşumunu tetikleyebilir.',
    tip: 'Cildi nazikçe temizleyin, bol su için ve ağır makyajdan kaçının.',
  },
  'Uykusuzluk': {
    title: 'Uykusuzluk',
    explanation: 'Progesteron dalgalanmaları ve PMS belirtileri uyku kalitesini bozabilir. Vücut sıcaklığındaki artış gece uykusunu etkiler.',
    tip: 'Yatmadan 1 saat önce ekranları kapatın, oda sıcaklığını serin tutun.',
  },
  'İştah değişimi': {
    title: 'İştah Değişimi',
    explanation: 'Serotonin düşüşü karbonhidrat ve tatlı isteğini artırabilir. Bu, regl öncesi vücudun enerji dengeleme çabasıdır.',
    tip: 'Sağlıklı atıştırmalıklar (meyve, kuruyemiş) ile tatlı isteğini dengelemeyi deneyin.',
  },
  'Baş dönmesi': {
    title: 'Baş Dönmesi',
    explanation: 'Kan şekeri dalgalanmaları, demir eksikliği veya regl kaynaklı kan hacmi değişimi baş dönmesine neden olabilir.',
    tip: 'Düzenli öğünler yiyin, aniden ayağa kalkmayın ve yeterli sıvı alın.',
  },
};

export function getSymptomInsights(selected: string[]): SymptomInsight[] {
  const insights: SymptomInsight[] = [];
  for (const name of selected) {
    const key = Object.keys(INSIGHT_MAP).find(k => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase()));
    if (key && !insights.some(i => i.title === INSIGHT_MAP[key].title)) {
      insights.push(INSIGHT_MAP[key]);
    }
  }
  if (insights.length === 0 && selected.length > 0) {
    insights.push({
      title: 'Kayıtlarınız Analiz Ediliyor',
      explanation: 'Seçtiğiniz belirtiler döngünüzle birlikte takip ediliyor. Zamanla hangi evrelerde hangi semptomların tekrarladığını görebileceksiniz.',
      tip: 'Düzenli kayıt, doktorunuzla paylaşırken çok değerli bir özet sunar.',
    });
  }
  return insights.slice(0, 3);
}
