export interface CoupleQuestion {
  id: string;
  category: string;
  question: string;
}

const BASE_QUESTIONS: CoupleQuestion[] = [
  // Romantizm & Anılar
  { id: 'q1', category: 'Romantizm & Anılar', question: 'Beni ilk gördüğünde aklından geçen ilk şey neydi?' },
  { id: 'q2', category: 'Romantizm & Anılar', question: 'Birlikte yaşadığımız hangi anı, kötü bir günümde seni gülümsetir?' },
  { id: 'q3', category: 'Romantizm & Anılar', question: 'İlk buluşmamızda en çok neye şaşırdın?' },
  { id: 'q4', category: 'Romantizm & Anılar', question: 'Bana âşık olduğunu tam olarak hangi an anladın?' },
  { id: 'q5', category: 'Romantizm & Anılar', question: 'Birlikte geçirdiğimiz en iyi tatil hangisiydi ve neden?' },
  { id: 'q6', category: 'Romantizm & Anılar', question: 'Beraber çektirdiğimiz en sevdiğin fotoğraf hangisi?' },
  { id: 'q7', category: 'Romantizm & Anılar', question: 'Sana kendimi en çok sevdirdiğim küçük alışkanlığım ne?' },
  { id: 'q8', category: 'Romantizm & Anılar', question: 'İlişkimizin ilk yılına dönebilseydin hangi günü tekrar yaşardın?' },

  // Gelecek & Hayaller
  { id: 'q9', category: 'Gelecek & Hayaller', question: '5 yıl sonra bizi nerede ve nasıl hayal ediyorsun?' },
  { id: 'q10', category: 'Gelecek & Hayaller', question: 'Birlikte öğrenmek istediğin bir beceri var mı?' },
  { id: 'q11', category: 'Gelecek & Hayaller', question: 'Emekli olduğumuzda hangi şehirde yaşamak isterdin?' },
  { id: 'q12', category: 'Gelecek & Hayaller', question: 'Sınırsız paramız olsa ilk hangi hayalimizi gerçekleştirirdik?' },
  { id: 'q13', category: 'Gelecek & Hayaller', question: 'Çocuğumuza aktarmak istediğin en önemli değer ne?' },
  { id: 'q14', category: 'Gelecek & Hayaller', question: 'Birlikte kurduğumuz hangi rutin hayatının sonuna kadar sürsün isterdin?' },
  { id: 'q15', category: 'Gelecek & Hayaller', question: 'Önümüzdeki yıl birlikte başarmak istediğin tek şey ne?' },
  { id: 'q16', category: 'Gelecek & Hayaller', question: 'Bir yıl boyunca başka bir ülkede yaşasak, nereyi seçerdin?' },

  // Sevgi Dili & Teşekkür
  { id: 'q17', category: 'Sevgi Dili & Teşekkür', question: 'Bugün senin için yaptığım hangi şey içini ısıttı?' },
  { id: 'q18', category: 'Sevgi Dili & Teşekkür', question: 'Sevildiğini en çok ne zaman hissediyorsun?' },
  { id: 'q19', category: 'Sevgi Dili & Teşekkür', question: 'Sana daha sık söylememi istediğin bir cümle var mı?' },
  { id: 'q20', category: 'Sevgi Dili & Teşekkür', question: 'Zor bir günün sonunda benden ne yapmamı beklersin?' },
  { id: 'q21', category: 'Sevgi Dili & Teşekkür', question: 'Sana dokunmanın hangi şekli seni en çok rahatlatıyor?' },
  { id: 'q22', category: 'Sevgi Dili & Teşekkür', question: 'Sana verdiğim en anlamlı hediye neydi?' },
  { id: 'q23', category: 'Sevgi Dili & Teşekkür', question: 'Bende en çok gurur duyduğun özellik hangisi?' },
  { id: 'q24', category: 'Sevgi Dili & Teşekkür', question: 'Bugün bana teşekkür etmek istediğin bir şey var mı?' },

  // Eğlenceli & Çılgın
  { id: 'q25', category: 'Eğlenceli & Çılgın', question: 'Bir günlüğüne yer değiştirsek ilk ne yapardın?' },
  { id: 'q26', category: 'Eğlenceli & Çılgın', question: 'Hayatımızın filmi çekilse başrolde hangi oyuncular olurdu?' },
  { id: 'q27', category: 'Eğlenceli & Çılgın', question: 'Beraber çıktığımız en absürt tartışma neydi?' },
  { id: 'q28', category: 'Eğlenceli & Çılgın', question: 'Benim en komik alışkanlığım ne?' },
  { id: 'q29', category: 'Eğlenceli & Çılgın', question: 'Bir süper gücün olsa hangisini seçerdin ve beni nasıl kullanırdın?' },
  { id: 'q30', category: 'Eğlenceli & Çılgın', question: 'Issız bir adaya düşsek yanına alacağın 3 şey ne olurdu?' },
  { id: 'q31', category: 'Eğlenceli & Çılgın', question: 'Bana taktığın gizli bir lakap var mı?' },
  { id: 'q32', category: 'Eğlenceli & Çılgın', question: 'Karaoke gecesinde birlikte hangi şarkıyı söylerdik?' },

  // İletişim & Derinlik
  { id: 'q33', category: 'İletişim & Derinlik', question: 'Kırıldığında bunu bana söylemek yerine sustuğun oldu mu?' },
  { id: 'q34', category: 'İletişim & Derinlik', question: 'Seni en çok ne zaman anlaşılmamış hissediyorsun?' },
  { id: 'q35', category: 'İletişim & Derinlik', question: 'İlişkimizde değiştirmek istediğin bir alışkanlık var mı?' },
  { id: 'q36', category: 'İletişim & Derinlik', question: 'Tartıştığımızda benden hangi davranışı görmek seni sakinleştirir?' },
  { id: 'q37', category: 'İletişim & Derinlik', question: 'Bana söylemekte zorlandığın bir şey var mı?' },
  { id: 'q38', category: 'İletişim & Derinlik', question: 'Ailemizle ilişkilerimizde neyi farklı yapmak isterdin?' },
  { id: 'q39', category: 'İletişim & Derinlik', question: 'Son bir ayda seni en çok ne yordu?' },
  { id: 'q40', category: 'İletişim & Derinlik', question: 'Benden en çok hangi konuda destek görmek istiyorsun?' },

  // Sağlık & Bedensel Farkındalık
  { id: 'q41', category: 'Sağlık & Farkındalık', question: 'Döngümün hangi döneminde sana daha zor geldiğimi fark ediyorsun?' },
  { id: 'q42', category: 'Sağlık & Farkındalık', question: 'Kendimi kötü hissettiğimde nasıl davranmamı tercih edersin?' },
  { id: 'q43', category: 'Sağlık & Farkındalık', question: 'Birlikte edinebileceğimiz bir sağlıklı alışkanlık öner.' },
  { id: 'q44', category: 'Sağlık & Farkındalık', question: 'Uyku düzenimizi iyileştirmek için ne deneyebiliriz?' },
  { id: 'q45', category: 'Sağlık & Farkındalık', question: 'Stresli olduğunda bedenin ilk nerede tepki veriyor?' },
  { id: 'q46', category: 'Sağlık & Farkındalık', question: 'Bir hafta boyunca birlikte bırakabileceğimiz bir alışkanlık var mı?' },

  // Ebeveynlik & Aile
  { id: 'q47', category: 'Ebeveynlik & Aile', question: 'Kendi ailenden almak istediğin ve istemediğin birer şey söyle.' },
  { id: 'q48', category: 'Ebeveynlik & Aile', question: 'Nasıl bir ebeveyn olacağımı düşünüyorsun?' },
  { id: 'q49', category: 'Ebeveynlik & Aile', question: 'Çocuğumuzla birlikte yapmayı en çok istediğin şey ne?' },
  { id: 'q50', category: 'Ebeveynlik & Aile', question: 'Ebeveynlikle ilgili en çok neden endişeleniyorsun?' },
  { id: 'q51', category: 'Ebeveynlik & Aile', question: 'Bebeğimize hangi ismi vermeyi hayal ediyorsun ve neden?' },
  { id: 'q52', category: 'Ebeveynlik & Aile', question: 'Çocukluğundan bize taşımak istediğin bir gelenek var mı?' },
];

const EXTRA_STEMS: Array<{ category: string; question: string }> = [
  { category: 'Romantizm & Anılar', question: 'Seni ilk öptüğümde aklından ne geçti?' },
  { category: 'Romantizm & Anılar', question: 'Birlikte dinlediğimiz hangi şarkı bizi anlatır?' },
  { category: 'Romantizm & Anılar', question: 'Bana hiç anlatmadığın, tanışmadan önceki küçük bir sırrın var mı?' },
  { category: 'Romantizm & Anılar', question: 'İlk evimizde en çok hangi köşeyi sevdin?' },
  { category: 'Romantizm & Anılar', question: 'Yağmurlu bir günde birlikte ne yapmak isterdin?' },
  { category: 'Gelecek & Hayaller', question: 'Birlikte açmak istediğin küçük bir iş var mı?' },
  { category: 'Gelecek & Hayaller', question: 'On yıl sonra kahvaltılarımız nasıl olsun?' },
  { category: 'Gelecek & Hayaller', question: 'Birlikte yazmak istediğin bir kitap konusu ne olurdu?' },
  { category: 'Gelecek & Hayaller', question: 'Hangi şehri “ikinci evimiz” yapmak isterdin?' },
  { category: 'Sevgi Dili & Teşekkür', question: 'Sessiz kaldığımda bunu nasıl yorumluyorsun?' },
  { category: 'Sevgi Dili & Teşekkür', question: 'Sana “yanındayım” dememin en iyi yolu ne?' },
  { category: 'Sevgi Dili & Teşekkür', question: 'Küçük jestlerden hangisi gününü kurtarır?' },
  { category: 'Eğlenceli & Çılgın', question: 'Beraber izlediğimiz en kötü film hangisiydi?' },
  { category: 'Eğlenceli & Çılgın', question: 'Sabah insanı mısın, gece kuşu mu? Beni nasıl tanımlarsın?' },
  { category: 'Eğlenceli & Çılgın', question: 'Bir kostüm partisine gitsek ne giyeriz?' },
  { category: 'İletişim & Derinlik', question: 'Tartışmadan sonra barışmak için ilk adımı kim atsın istersin?' },
  { category: 'İletişim & Derinlik', question: 'Seni dinlemediğimi hissettiğin bir an oldu mu?' },
  { category: 'İletişim & Derinlik', question: 'Ailemizle bir sınır koymamızı istediğin konu var mı?' },
  { category: 'Sağlık & Farkındalık', question: 'Birlikte yürüyüşe çıksak hangi saati tercih edersin?' },
  { category: 'Sağlık & Farkındalık', question: 'Telefonsuz bir akşamı nasıl geçirmek isterdin?' },
  { category: 'Sağlık & Farkındalık', question: 'Yorgunluğumu nasıl daha erken fark edebilirim?' },
  { category: 'Ebeveynlik & Aile', question: 'Çocuğumuza hangi masalı okumak isterdin?' },
  { category: 'Ebeveynlik & Aile', question: 'Büyüklerimizden almak istemediğin bir alışkanlık var mı?' },
  { category: 'Romantizm & Anılar', question: 'Sana yazdığım notlardan hangisi aklında kaldı?' },
  { category: 'Gelecek & Hayaller', question: 'Bir yıl boyunca her ay yeni bir şey denesek, ilk ne olsun?' },
  { category: 'Sevgi Dili & Teşekkür', question: 'Bugün benden duyunca içinin ısınacağı cümle ne?' },
  { category: 'Eğlenceli & Çılgın', question: 'Beraber oynadığımız en komik oyun hangisiydi?' },
  { category: 'İletişim & Derinlik', question: 'Kırıldığında benden uzaklaşmak mı, konuşmak mı istersin?' },
  { category: 'Sağlık & Farkındalık', question: 'Uyku saati konusunda benden ne bekliyorsun?' },
  { category: 'Ebeveynlik & Aile', question: 'Çocuğumuza öğretmek istediğin ilk ev kuralı ne olurdu?' },
];

const PREFIXES = [
  '',
  'Dürüstçe söyle: ',
  'Bir cümleyle: ',
  'Bugün aklına gelen haliyle: ',
  'Acele etmeden düşün: ',
  'Gülümseyerek cevapla: ',
  'Kalbinden geleni söyle: ',
  'Kısa tutarak: ',
  'Bu akşam konuşsak: ',
  'İçinden geleni yaz: ',
  'Şaka olmadan: ',
];

function buildYearQuestions(): CoupleQuestion[] {
  const out: CoupleQuestion[] = [...BASE_QUESTIONS];
  let n = out.length + 1;
  let extra = 0;
  while (out.length < 365) {
    const stem = EXTRA_STEMS[extra % EXTRA_STEMS.length];
    const prefix = PREFIXES[Math.floor(extra / EXTRA_STEMS.length) % PREFIXES.length];
    const question = `${prefix}${stem.question}`.replace(/^ +/, '');
    if (!out.some((q) => q.question === question)) {
      out.push({ id: `q${n}`, category: stem.category, question });
      n += 1;
    }
    extra += 1;
    if (extra > 2000) break;
  }
  return out;
}

export const COUPLE_QUESTIONS = buildYearQuestions();

export function questionOfTheDay(seed = new Date()): CoupleQuestion {
  const dayIndex = Math.floor(
    Date.UTC(seed.getFullYear(), seed.getMonth(), seed.getDate()) / (24 * 60 * 60 * 1000),
  );
  return COUPLE_QUESTIONS[dayIndex % COUPLE_QUESTIONS.length];
}
