import { Injectable, NotFoundException } from '@nestjs/common';
import { foldTr } from '../common/text';

export interface ArticleItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryName: string;
  author: string;
  authorTitle: string;
  readTime: string;
  hasAudio: boolean;
  audioDuration?: string;
  imageUrl?: string;
  summary: string;
  content: string[];
  tags: string[];
  reviewedBy: string;
}

@Injectable()
export class ArticlesService {
  private articles: ArticleItem[] = [
    {
      id: 'art-1',
      title: 'Foliküler Evrede Bedeninizde Neler Değişir?',
      subtitle: 'Foliküler evre regl ile başlar; östrojen yavaş yükselir',
      category: 'cycle',
      categoryName: 'Döngü & Hormonlar',
      author: 'Dr. Zeynep Kaya',
      authorTitle: 'Kadın Hastalıkları ve Doğum Uzmanı',
      readTime: '4 dk',
      hasAudio: false,
      audioDuration: '5:20',
      summary: 'Foliküler evre adetin ilk gününde başlar ve yumurtlamaya kadar sürer. Kanama bittikten sonra östrojen yükselir; enerji artışı genellikle o dönemde hissedilir.',
      content: [
        'Foliküler evre, adet kanamasının 1. gününden yumurtlamaya kadar olan süredir. Yani regl, bu evrenin dışında değil içindedir.',
        'Hipofizden salgılanan FSH, yumurtalıklarda bir folikülün olgunlaşmasını sağlar. Kanama bittikten sonra östrojen daha belirgin yükselir.',
        'Östrojen yükseldikçe birçok kişide enerji, cilt ve odaklanma toparlanır. Bu bir kural değil, sık görülen bir eğilimdir.',
        'Beslenme: yeşil yapraklılar, protein ve sağlıklı yağlar yeterlidir. Tek bir “süper besin” döngüyü değiştirmez. Bilgiler geneldir; şikayetiniz varsa hekime danışın.',
      ],
      tags: ['Foliküler Evre', 'Östrojen', 'Enerji', 'Hormonlar'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Zeynep Kaya',
    },
    {
      id: 'art-2',
      title: 'Ovülasyon (Yumurtlama) Gününü Nasıl Anlarsınız?',
      subtitle: 'Servikal akıntı, bazal sıcaklık ve vücudun verdiği 5 temel sinyal',
      category: 'fertility',
      categoryName: 'Beden & Cinsellik',
      author: 'Prof. Dr. Melis Erdem',
      authorTitle: 'Üreme Sağlığı ve Tüp Bebek Uzmanı',
      readTime: '5 dk',
      hasAudio: false,
      audioDuration: '6:10',
      summary: 'Doğurgan dönemin en kritik günü olan ovülasyonu yakalamanın bilimsel ve pratik yöntemleri.',
      content: [
        'Ovülasyon, olgunlaşan yumurtanın fallop tüpüne bırakılması olayıdır ve sperm ile buluşmak için yalnızca 12-24 saat canlı kalır.',
        'Servikal Mukus Değişimi: Yumurtlamaya yakın günlerde akıntı şeffaf, esnek ve çiğ yumurta akı kıvamına gelir. Bu yapı spermin rahim ağzından kolayca yüzmesini sağlar.',
        'Bazal Vücut Sıcaklığı (BBT): Yumurtlama gerçekleştiğinde progesteron salgısı nedeniyle vücut sıcaklığınız yaklaşık 0.3 - 0.5 °C yükselir.',
        'Hafif kasık ağrısı (Mittelschmerz) ve koku duyarlılığında artış da diğer yaygın ipuçları arasındadır.'
      ],
      tags: ['Ovülasyon', 'Doğurganlık', 'Akıntı', 'BBT'],
      reviewedBy: 'Tıp Kurulu Onaylı • Prof. Dr. Melis Erdem',
    },
    {
      id: 'art-3',
      title: 'Hamilelik Öncesi Folik Asit ve Vitamin Rehberi',
      subtitle: 'Sağlıklı bir gebelik için döllenmeden en az 3 ay önce bilinmesi gerekenler',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      author: 'Dr. Selin Demir',
      authorTitle: 'Perinatoloji ve Kadın Doğum Uzmanı',
      readTime: '6 dk',
      hasAudio: false,
      summary: 'Nöral tüp gelişiminden hücre yenilenmesine folik asit ve mikrobesinlerin hayati rolleri.',
      content: [
        'Folik asit (B9 vitamini), bebeğin omurilik ve beyin gelişiminde nöral tüp defektlerini %70 oranında önlemeye yardımcı olur.',
        'Gebel planlamasından en az 8-12 hafta önce günlük 400 mcg folik asit takviyesine başlanması Dünya Sağlık Örgütü tarafından önerilmektedir.',
        'Bununla birlikte D Vitamini, Omega-3 (DHA/EPA), Demir ve Çinko düzeylerinizi kan testiyle kontrol ettirmeniz sürecin konforunu artıracaktır.'
      ],
      tags: ['Folik Asit', 'Gebelik', 'Vitaminler', 'Bebek Sağlığı'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Selin Demir',
    },
    {
      id: 'art-4',
      title: 'Luteal Evrede Duygusal Dalgalanmalar ve PMS',
      subtitle: 'Progesteron etkisi, kaygı yönetimi ve kendinize şefkat göstermenin yolları',
      category: 'mood',
      categoryName: 'Ruh Hali & Zihin',
      author: 'Uzm. Psk. Derya Güneş',
      authorTitle: 'Klinik Psikolog & Çift Terapisti',
      readTime: '4 dk',
      hasAudio: false,
      audioDuration: '4:45',
      summary: 'Döngünün ikinci yarısında progesteron seviyesinin yükselip aniden düşmesiyle yaşanan duygusal değişimleri yönetme rehberi.',
      content: [
        'Ovülasyondan hemen sonra başlayan Luteal evrede vücut olası bir gebeliğe hazırlanır ve progesteron üretimi zirve yapar.',
        'Progesteron sakinleştirici bir etkiye sahip olsa da adet öncesi günlerde aniden düşmesi melankoli, tahammülsüzlük veya kaygıya zemin hazırlayabilir.',
        'Bu günlerde yoğun kardiyo yerine nefes çalışmaları, yürüyüş, magnezyum zengini besinler ve ılık banyolar sinir sisteminizi dengeler.'
      ],
      tags: ['PMS', 'Luteal Evre', 'Ruh Hali', 'Magnezyum'],
      reviewedBy: 'Tıp Kurulu Onaylı • Uzm. Psk. Derya Güneş',
    },
    {
      id: 'art-5',
      title: 'Döngünüze Göre Egzersiz ve Hareket Stratejisi',
      subtitle: 'Adet döneminden ovülasyona hangi sporu yapmalısınız?',
      category: 'fitness',
      categoryName: 'Beslenme & Egzersiz',
      author: 'Buket Tunç',
      authorTitle: 'Kadın Fizyolojisi & Bütünsel Egzersiz Koçu',
      readTime: '5 dk',
      hasAudio: false,
      summary: 'Hormonal ritminize uyum sağlayarak daha fazla kalori yakın, yorgunluğu önleyin ve gücünüzü artırın.',
      content: [
        'Aşağıdaki gün aralıkları 28 günlük örnek bir döngü içindir. Sizin döngünüz daha kısa veya uzun olabilir; yumurtlama çoğu kişide bir sonraki adetten yaklaşık 14 gün önce olur.',
        'Kanama günleri: dinlenmek zorunda değilsiniz. Ağrı yoksa yürüyüş ve hafif esneme yeter; şiddetli krampta tempo düşürün.',
        'Kanama bittikten yumurtlamaya kadar: enerji genelde artar. Koşu veya kuvvet antrenmanı bu evrede daha kolay gelebilir.',
        'Yumurtlama civarı: bazı kişilerde bağ gevşekliği artar; ağır kaldırmada formu koruyun.',
        'Luteal evre: yorgunluk normal olabilir. Yürüyüş, pilates ve kısa antrenman daha sürdürülebilirdir. Bu bir antrenman programı değil, genel eğilimdir.',
      ],
      tags: ['Egzersiz', 'Döngü Senkronizasyonu', 'Pilates', 'Kardiyo'],
      reviewedBy: 'Tıp Kurulu Onaylı • Buket Tunç',
    },
    {
      id: 'art-6',
      title: 'Partnerinizle Açık ve Güvenli İletişim',
      subtitle: 'Cinsel istek, döngü ihtiyaçları ve duygusal yakınlığı güçlendirmek',
      category: 'fertility',
      categoryName: 'Beden & Cinsellik',
      author: 'Dr. Ceyda Aksoy',
      authorTitle: 'Cinsel Sağlık Danışmanı',
      readTime: '3 dk',
      hasAudio: false,
      audioDuration: '3:50',
      summary: 'İstek seviyelerinizin dönemsel iniş çıkışlarını partnerinizle rahatça paylaşarak aranızdaki bağı güçlendirin.',
      content: [
        'Cinsel isteğin ay boyunca dalgalanması tamamen doğaldır ve hormonal dengelerle doğrudan bağlantılıdır.',
        'Partnerinizi döngünüzden haberdar etmek (Pusena Partner Modu ile) onların beklentilerini dengeler ve size doğru zamanda doğru desteği vermelerini sağlar.',
        'İletişimde "Ben" dili kullanmak ("Bugün biraz halsiz hissediyorum ve sarılmaya ihtiyacım var") ilişkinizde derin bir güven yaratır.'
      ],
      tags: ['İletişim', 'Cinsellik', 'Partner', 'Yakınlık'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Ceyda Aksoy',
    },
    {
      id: 'art-7',
      title: 'Luteal Evrede Neden Yorgun Hissediyorum?',
      subtitle: 'Progesteron yükselişi ve PMS öncesi enerji düşüşünün bilimsel açıklaması',
      category: 'cycle',
      categoryName: 'Döngü & Hormonlar',
      author: 'Dr. Ceyda Aksoy',
      authorTitle: 'Kadın Sağlığı Uzmanı',
      readTime: '4 dk',
      hasAudio: false,
      summary: 'Ovülasyondan regle kadar geçen luteal evrede progesteron artışı enerji ve ruh halinizi nasıl etkiler?',
      content: [
        'Luteal evre, yumurtlama sonrası regle kadar süren yaklaşık 12-14 günlük dönemdir. Bu sürede progesteron hormonu yükselir.',
        'Progesteron vücut sıcaklığını artırır ve sindirimi yavaşlatır; bu nedenle halsizlik ve şişkinlik hissedebilirsiniz.',
        'Regle 5-7 gün kala östrojen de düşmeye başlar; birlikte PMS belirtileri (sinirlilik, yorgunluk, iştah değişimi) ortaya çıkar.',
        'Demir eksikliği varsa bu dönemde yorgunluk daha belirgin olabilir. Kan testi ile kontrol ettirmek faydalıdır.',
      ],
      tags: ['Luteal Evre', 'PMS', 'Progesteron', 'Yorgunluk'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Ceyda Aksoy',
    },
    {
      id: 'art-8',
      title: 'Hamilelikte Demir Eksikliği: Belirtiler ve Çözümler',
      subtitle: 'Anemi riski, kan tahlili ve beslenme önerileri',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      author: 'Uzm. Dyt. Selin Yıldız',
      authorTitle: 'Klinik Beslenme Uzmanı',
      readTime: '5 dk',
      hasAudio: false,
      summary: 'Gebelikte kan hacmi artışı demir ihtiyacını yükseltir. Eksiklik belirtilerini tanıyın ve önleyin.',
      content: [
        'Hamilelikte kan hacmi %40-50 artar; bu da demir ihtiyacını artırır. Yetersiz demir anemiye yol açabilir.',
        'Belirtiler: aşırı yorgunluk, soluk cilt, çarpıntı, saç dökülmesi ve konsantrasyon güçlüğü.',
        'Kırmızı et, mercimek, ıspanak ve C vitamini ile birlikte tüketilen demir kaynakları emilimi artırır.',
        'Doktorunuzun önerdiği demir takviyesini aç karnına almayın; mide bulantısını artırabilir.',
      ],
      tags: ['Demir', 'Anemi', 'Beslenme', 'Hamilelik'],
      reviewedBy: 'Tıp Kurulu Onaylı • Uzm. Dyt. Selin Yıldız',
    },
    {
      id: 'art-9',
      title: 'Servikal Akıntı Renkleri Ne Anlama Gelir?',
      subtitle: 'Beyaz, sarı, yeşil ve kahverengi akıntıların olası nedenleri',
      category: 'fertility',
      categoryName: 'Beden & Cinsellik',
      author: 'Dr. Zeynep Kaya',
      authorTitle: 'Kadın Hastalıkları ve Doğum Uzmanı',
      readTime: '6 dk',
      hasAudio: false,
      summary: 'Akıntı rengi ve kıvamı döngünüzün evresini ve olası sağlık durumlarını yansıtabilir.',
      content: [
        'Şeffaf ve kaygan akıntı (yumurta akı kıvamı) genellikle ovülasyon döneminde görülür ve doğurganlık göstergesidir.',
        'Beyaz, krem rengi akıntı luteal evrede normaldir. Kaşıntı ve koku eşlik ediyorsa mantar enfeksiyonu düşünülebilir.',
        'Sarı-yeşil, köpüklü akıntı bakteriyel vaginoz veya trikomonas belirtisi olabilir; doktora başvurun.',
        'Kahverengi lekelenme regl öncesi/sonrası veya implantasyon döneminde görülebilir; şiddetli kanama farklıdır.',
      ],
      tags: ['Akıntı', 'Servikal Mukus', 'Sağlık', 'Ovülasyon'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Zeynep Kaya',
    },
    {
      id: 'art-10',
      title: 'Stres Döngünüzü Nasıl Etkiler?',
      subtitle: 'Kortizol, gecikmiş regl ve amenore hakkında bilmeniz gerekenler',
      category: 'mood',
      categoryName: 'Ruh Hali & Zihin',
      author: 'Dr. Selin Demir',
      authorTitle: 'Kadın Doğum Uzmanı',
      readTime: '4 dk',
      hasAudio: false,
      summary: 'Kronik stres hipotalamus-hipofiz-ovaryen ekseni baskılayarak regl gecikmesine neden olabilir.',
      content: [
        'Yoğun stres kortizol salgısını artırır; bu da GnRH hormonunu baskılayarak ovülasyonu geciktirebilir.',
        'Sınav, iş değişikliği, seyahat veya duygusal travma sonrası 1-2 döngü gecikmesi sık görülür.',
        '3 aydan uzun regl olmaması (amenore) durumunda mutlaka jinekolog değerlendirmesi gerekir.',
        'Nefes egzersizi, düzenli uyku, hafif egzersiz ve sosyal destek stres yönetiminde etkilidir.',
      ],
      tags: ['Stres', 'Amenore', 'Döngü', 'Ruh Hali'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Selin Demir',
    },
    {
      id: 'art-11',
      title: 'Hamilelikte Güvenli Egzersiz Rehberi',
      subtitle: 'Hangi aktiviteler güvenli, hangilerinden kaçınmalısınız?',
      category: 'fitness',
      categoryName: 'Beslenme & Egzersiz',
      author: 'Buket Tunç',
      authorTitle: 'Hamilelik Pilates Eğitmeni',
      readTime: '5 dk',
      hasAudio: false,
      summary: 'Düzenli egzersiz gebelikte enerji, uyku ve doğuma hazırlık açısından faydalıdır; doğru türü seçmek önemlidir.',
      content: [
        'Düşük riskli gebeliklerde haftada 150 dakika orta yoğunlukta egzersiz (yürüyüş, yüzme, hamile pilatesi) önerilir.',
        'Denge kaybı riski nedeniyle contact sporları, dalış ve sırtüstü uzun süre yatmaktan kaçının.',
        'Nefes tutmadan, kontrollü hareketler yapın. Baş dönmesi veya vajinal kanama olursa durun.',
        'Pelvik taban (Kegel) egzersizleri doğum öncesi ve sonrası için özellikle değerlidir.',
      ],
      tags: ['Egzersiz', 'Hamilelik', 'Pilates', 'Güvenlik'],
      reviewedBy: 'Tıp Kurulu Onaylı • Buket Tunç',
    },
    {
      id: 'art-12',
      title: 'Doğum Sonrası Lohusalık Dönemi: İlk 6 Hafta',
      subtitle: 'Fiziksel iyileşme, emzirme ve duygusal değişimler',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      author: 'Dr. Zeynep Kaya',
      authorTitle: 'Kadın Hastalıkları ve Doğum Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'Lohusalık döneminde vücudunuzun geçirdiği değişimleri anlamak iyileşme sürecini kolaylaştırır.',
      content: [
        'İlk 6 hafta rahim involusyonu (küçülme) devam eder; lohusa kanaması kademeli azalır.',
        'Emzirme uterus kasılmalarını destekler ve kilo vermeye yardımcı olabilir.',
        'Baby blues (3-5 gün) normaldir; 2 haftadan uzun süren üzüntü ve ilgisizlik postpartum depresyon belirtisi olabilir.',
        'Ağır kaldırmaktan, tampon kullanımından ve cinsel ilişkiden doktor onayına kadar kaçının.',
      ],
      tags: ['Lohusalık', 'Doğum Sonrası', 'Emzirme', 'İyileşme'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Zeynep Kaya',
    },
    {
      id: 'art-13',
      title: 'Ovülasyon Testleri (LH Stripleri) Nasıl Kullanılır?',
      subtitle: 'LH pikini yakalamak, doğru saat seçimi ve sonuçları yorumlama rehberi',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Prof. Dr. Melis Erdem',
      authorTitle: 'Üreme Sağlığı ve Tüp Bebek Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'Ovülasyon testleri idrardaki LH hormonu artışını ölçerek yumurtlamadan 24-36 saat önce sizi uyarır. Doğru kullanıldığında doğurganlık penceresini netleştirir.',
      content: [
        'Ovülasyon testleri (LH stripleri), idrarda luteinize edici hormon (LH) düzeyindeki ani yükselişi tespit eder. Bu yükseliş "LH piki" olarak adlandırılır ve yumurtlamayı tetikleyen sinyaldir. Test pozitifleştikten sonra yumurtlama genellikle 24-36 saat içinde gerçekleşir; bu yüzden pozitif sonuç, birlikteliğin zamanlaması için son derece değerli bir bilgidir.',
        'Teste ne zaman başlamalı? Ortalama döngü uzunluğunuzdan 17 çıkarın. Örneğin 28 günlük bir döngüde regl kanamasının ilk gününden itibaren 11. günde test yapmaya başlamak uygundur. Döngüsü düzensiz olanlar en kısa döngü uzunluğunu esas alarak birkaç gün daha erken başlamalıdır.',
        'Günün hangi saati? LH çoğu kadında sabahın erken saatlerinde kana salınır ancak idrara geçişi birkaç saat sürer. Bu nedenle en güvenilir zaman aralığı öğleden sonra 10:00-20:00 arasıdır. Aynı saatte test etmeye özen gösterin ve testten önce 2 saat kadar aşırı sıvı tüketmeyin; seyrelmiş idrar yanlış negatif sonuca yol açabilir.',
        'Sonuç nasıl okunur? Test çizgisi kontrol çizgisi kadar koyu veya daha koyu ise sonuç pozitiftir. Silik bir çizgi genellikle negatif kabul edilir; ancak çizginin günden güne koyulaşmasını takip etmek pike yaklaştığınızı gösterir. Dijital testlerde bu yorum farkı ortadan kalkar, gülen yüz veya "peak" ibaresi görünür.',
        'Pozitif çıkınca ne yapmalı? Pozitif günde ve ertesi gün birliktelik önerilir. Sperm kadın üreme kanalında 3-5 gün canlı kalabildiği için pikten 1-2 gün önce başlayıp gün aşırı devam eden bir düzen de en az günlük ilişki kadar etkilidir.',
        'Yanıltıcı durumlar: Polikistik over sendromunda (PCOS) bazal LH düzeyi kronik olarak yüksek olabilir ve testler sürekli pozitif gibi görünebilir. Ayrıca ovülasyon indüksiyonunda kullanılan hCG içeren iğneler ve bazı doğurganlık ilaçları yanlış pozitif verebilir. Menopoz geçiş döneminde de LH yüksekliği yanıltıcıdır.',
        'Önemli sınır: Pozitif LH testi yumurtlamanın kesin gerçekleştiğini kanıtlamaz, yalnızca tetiklendiğini gösterir. Yumurtlamayı doğrulamak için bazal vücut sıcaklığı takibi veya döngünün 21. günü civarında bakılan progesteron ölçümü kullanılır. Üst üste 3 döngüde hiç pozitif sonuç alamıyorsanız hekiminize başvurun.',
      ],
      tags: ['Ovülasyon Testi', 'LH', 'Doğurganlık Penceresi', 'Gebe Kalma'],
      reviewedBy: 'Tıp Kurulu Onaylı • Prof. Dr. Melis Erdem',
    },
    {
      id: 'art-14',
      title: 'İki Hafta Bekleme Dönemi (2WW): Belirtiler ve Gerçekler',
      subtitle: 'Ovülasyondan test gününe kadar bedeninizde gerçekten neler oluyor?',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Dr. Selin Demir',
      authorTitle: 'Perinatoloji ve Kadın Doğum Uzmanı',
      readTime: '6 dk',
      hasAudio: false,
      summary: 'Yumurtlama ile gebelik testi arasındaki iki hafta, hem fizyolojik hem duygusal olarak yoğun bir dönemdir. Bu süreçte hangi belirtiler anlamlı, hangileri yanıltıcıdır?',
      content: [
        'İki hafta bekleme dönemi (two week wait, 2WW), yumurtlamadan sonra gebelik testinin güvenilir sonuç verebileceği güne kadar geçen yaklaşık 12-14 günlük luteal evreyi tanımlar. Bu dönemde döllenme olsa da olmasa da progesteron yükselir; işte bu yüzden belirtiler ayırt edilemez.',
        'Zaman çizelgesi: Döllenme, yumurtlamadan sonraki 12-24 saat içinde fallop tüpünde gerçekleşir. Embriyo 6-10 gün içinde rahim iç zarına tutunur (implantasyon). hCG hormonu ancak implantasyondan sonra salgılanmaya başlar ve her 48-72 saatte iki katına çıkar.',
        'Gerçekten olabilecek belirtiler: Hafif pembe-kahverengi lekelenme (implantasyon kanaması, genellikle 1-2 gün ve adetten çok daha hafif), meme hassasiyeti, hafif kramplar, yorgunluk, sık idrara çıkma ve koku duyarlılığı. Ancak bunların neredeyse tamamı progesteronun doğal etkisiyle de ortaya çıkar.',
        'Yanıltıcı olan nedir? Adet öncesi sendromu (PMS) ile erken gebelik belirtileri fizyolojik olarak büyük ölçüde aynıdır. Şişkinlik, duygusal dalgalanma, göğüs dolgunluğu ve iştah değişimi her iki durumda da görülür. "Belirti avcılığı" yapmak kaygıyı artırır ve bilgi değeri düşüktür; tek kesin gösterge testtir.',
        'Ne zaman test yapılmalı? En doğru sonuç için beklenen adet tarihini geçmesini, yani ovülasyondan sonra en az 12-14 günü beklemek gerekir. Daha erken yapılan testler "kimyasal gebelik" olarak adlandırılan çok erken kayıpları yakalayabilir ve gereksiz üzüntüye yol açabilir.',
        'Bu dönemde yapılabilecekler: Folik asit takviyesine devam edin, sigara ve alkolden uzak durun, kafeini günde 200 mg altında tutun, orta yoğunlukta egzersizi sürdürün. Doktorunuz aksini söylemedikçe ağrı kesici olarak parasetamol tercih edilir; NSAİİ grubu ilaçlar implantasyonu etkileyebileceği için kaçınılır.',
        'Duygusal yönetim: Bu iki hafta birçok kişi için döngünün en zorlayıcı kısmıdır. Takvimi sürekli kontrol etmek yerine günlük rutin, nefes çalışmaları, hafif yürüyüş ve partnerle açık iletişim kaygıyı belirgin şekilde azaltır. Testin sonucu ne olursa olsun tek bir döngü, doğurganlığınız hakkında nihai bir bilgi vermez.',
      ],
      tags: ['2WW', 'Luteal Evre', 'İmplantasyon', 'Gebelik Belirtileri'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Selin Demir',
    },
    {
      id: 'art-15',
      title: 'PCOS ile Gebe Kalmak: Kanıta Dayalı Yöntemler',
      subtitle: 'Yaşam tarzı, insülin direnci yönetimi ve ovülasyon indüksiyonu',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Prof. Dr. Melis Erdem',
      authorTitle: 'Üreme Endokrinolojisi Uzmanı',
      readTime: '8 dk',
      hasAudio: false,
      summary: 'Polikistik over sendromu ovülasyon bozukluğunun en sık nedenidir; ancak doğru tedavi basamaklarıyla PCOS olan kadınların büyük kısmı gebe kalabilir.',
      content: [
        'PCOS (polikistik over sendromu), düzensiz veya hiç olmayan yumurtlama, androjen (erkeklik hormonu) fazlalığı ve ultrasonda çok folliküllü over görünümünden en az ikisinin bir arada bulunmasıyla tanınır. Üreme çağındaki kadınların yaklaşık %8-13\'ünü etkiler ve ovülasyon kaynaklı infertilitenin en yaygın sebebidir.',
        'Temel mekanizma çoğu zaman insülin direncidir. Yükselen insülin, yumurtalıklarda androjen üretimini artırır ve folikülün olgunlaşıp çatlamasını engeller. Bu nedenle tedavinin merkezinde hormon ilaçlarından önce metabolik denge yer alır.',
        'Yaşam tarzı ilk basamaktır: Fazla kilo varsa vücut ağırlığının %5-10\'unu kaybetmek, birçok kadında kendiliğinden ovülasyonu geri getirir. Haftada 150 dakika orta yoğunlukta aerobik egzersiz ile 2 gün direnç antrenmanı insülin duyarlılığını doğrudan artırır. Düşük glisemik indeksli, lif ve protein açısından zengin bir beslenme düzeni kan şekeri dalgalanmasını azaltır.',
        'İlaç tedavisi: Ovülasyon indüksiyonunda güncel birinci seçenek letrozoldür; klomifen sitrata kıyasla daha yüksek canlı doğum oranları göstermiştir. Metformin özellikle insülin direnci ve bozulmuş glukoz toleransı olanlarda döngü düzenini iyileştirir. Bu tedavilerin tamamı hekim gözetiminde, ultrason takibiyle uygulanmalıdır; kontrolsüz kullanım çoğul gebelik ve over hiperstimülasyon riski taşır.',
        'İleri adımlar: 6 siklus ovülasyon indüksiyonuna yanıt alınamazsa gonadotropin tedavisi, laparoskopik over drilling veya tüp bebek (IVF) seçenekleri değerlendirilir. Karar verirken kadının yaşı, yumurtalık rezervi, tüp açıklığı ve erkek faktörü birlikte ele alınır.',
        'Takviyeler ve kanıt düzeyi: Folik asit tüm gebelik planlarında zorunludur. D vitamini eksikliği yaygındır ve düzeltilmesi önerilir. İnositol (myo-inositol/D-chiro-inositol) döngü düzenliliği üzerinde umut verici sonuçlar göstermiştir ancak kanıt düzeyi metformin kadar güçlü değildir. Takviyeleri hekiminize danışmadan başlatmayın.',
        'Gebelik sonrası dikkat: PCOS\'ta gebelik diyabeti, preeklampsi ve erken doğum riski bir miktar yüksektir. Bu nedenle gebelik doğrulandığında erken dönemde şeker yükleme testi planı ve düzenli tansiyon takibi yapılmalıdır.',
        'Umut verici gerçek: PCOS bir kısırlık teşhisi değildir. Düzenli takip, yaşam tarzı düzenlemesi ve gerektiğinde tedavi ile PCOS tanılı kadınların büyük bölümü çocuk sahibi olur.',
      ],
      tags: ['PCOS', 'İnsülin Direnci', 'Ovülasyon İndüksiyonu', 'Doğurganlık'],
      reviewedBy: 'Tıp Kurulu Onaylı • Prof. Dr. Melis Erdem',
    },
    {
      id: 'art-16',
      title: 'Sperm Kalitesini Artırmanın 8 Yolu (Partner Rehberi)',
      subtitle: 'Isı, beslenme, uyku ve alışkanlıkların sperm sağlığına etkisi',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Doç. Dr. Emre Aydın',
      authorTitle: 'Üroloji ve Androloji Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'İnfertilite vakalarının yaklaşık yarısında erkek faktörü rol oynar. Sperm üretimi 72-90 günde tamamlandığı için bugün yapılan değişiklikler 3 ay içinde ölçülebilir fark yaratır.',
      content: [
        'Sperm hücresinin olgunlaşması yaklaşık 72-90 gün sürer. Bu nedenle beslenme, uyku ve alışkanlık değişikliklerinin spermiyograma yansıması için en az üç aylık bir süre gerekir. Sabırlı ve tutarlı olmak, kısa süreli katı programlardan daha etkilidir.',
        '1) Sigarayı bırakın. Sigara sperm sayısını, hareketliliğini ve DNA bütünlüğünü belirgin şekilde bozar. Elektronik sigara ve nargile de güvenli alternatif değildir.',
        '2) Alkolü sınırlayın. Düzenli ve yüksek miktarda alkol testosteron üretimini baskılar, sperm morfolojisini bozar. Gebelik planlanan dönemde en güvenli yaklaşım alkolü tamamen bırakmaktır.',
        '3) Isıdan koruyun. Testisler vücut sıcaklığının 2-3 derece altında çalışır. Sıcak küvet, sauna, dizüstü bilgisayarı kucakta uzun süre kullanmak ve çok dar iç çamaşırı sperm üretimini geçici olarak azaltır. Nefes alan, bol iç çamaşırı tercih edin.',
        '4) Kiloyu dengeleyin. Obezite, testosteronun östrojene dönüşümünü artırır ve sperm sayısını düşürür. Vücut kitle indeksini 20-25 aralığına yaklaştırmak ölçülebilir iyileşme sağlar.',
        '5) Antioksidan açısından zengin beslenin. Çinko (kırmızı et, kabak çekirdeği), selenyum (Brezilya cevizi), folat (yeşil yapraklılar), C ve E vitaminleri, omega-3 (somon, ceviz) sperm DNA hasarını azaltır. İşlenmiş et, trans yağ ve aşırı şekerden uzak durun.',
        '6) Düzenli ve yeterli uyuyun. Gecede 7-8 saatin altına inen uyku, testosteron salgısının ana penceresini daraltır. Kronik stres de kortizol üzerinden üreme hormonlarını baskılar; nefes çalışması ve düzenli egzersiz burada işe yarar.',
        '7) İlişki sıklığını dengede tutun. Çok seyrek ilişki sperm hareketliliğini azaltırken, uzun perhiz de DNA hasarını artırır. Doğurganlık penceresinde gün aşırı veya günlük birliktelik ideal aralıktır.',
        '8) Toksinlerden ve gereksiz ilaçlardan kaçının. Pestisitler, ağır metaller, endüstriyel çözücüler ve bazı ilaçlar (anabolik steroidler, testosteron takviyesi, bazı saç dökülmesi ilaçları) sperm üretimini ciddi biçimde baskılar. Anabolik steroid kullanımı kalıcı hasar bırakabilir.',
        'Ne zaman doktora? 12 ay (kadın 35 yaş üzerindeyse 6 ay) korunmasız denemeye rağmen gebelik oluşmadıysa spermiyogram yapılmalıdır. Test öncesi 2-5 gün cinsel perhiz gerekir ve tek bir anormal sonuç kesin tanı değildir; 2-3 hafta arayla tekrar edilir.',
      ],
      tags: ['Sperm Kalitesi', 'Erkek Faktörü', 'Spermiyogram', 'Partner'],
      reviewedBy: 'Tıp Kurulu Onaylı • Doç. Dr. Emre Aydın',
    },
    {
      id: 'art-17',
      title: 'Bazal Vücut Sıcaklığı (BBT) Takibi: Adım Adım',
      subtitle: 'Ovülasyonu doğrulamak için en ekonomik ve güvenilir yöntem',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Dr. Ceyda Aksoy',
      authorTitle: 'Kadın Sağlığı ve Doğurganlık Farkındalığı Uzmanı',
      readTime: '6 dk',
      hasAudio: false,
      summary: 'BBT takibi yumurtlamayı önceden haber vermez ama gerçekleştiğini doğrular ve luteal evre uzunluğunuzu gösterir. Doğru teknikle tutulan bir grafik çok değerli bilgi taşır.',
      content: [
        'Bazal vücut sıcaklığı, tam dinlenme halindeki en düşük vücut sıcaklığıdır. Yumurtlamadan sonra korpus luteumdan salgılanan progesteron, sıcaklığı kalıcı olarak yaklaşık 0.3-0.5 °C yükseltir. Bu iki katmanlı grafik (ovülasyon öncesi düşük, sonrası yüksek plato) yumurtlamanın gerçekleştiğinin güçlü kanıtıdır.',
        'Adım 1 - Doğru termometre: 0.01 derece hassasiyetinde bazal termometre kullanın. Standart ateş ölçerin çözünürlüğü bu küçük değişimi güvenilir biçimde göstermez.',
        'Adım 2 - Doğru zaman: Ölçümü her sabah aynı saatte, en az 3-4 saatlik kesintisiz uykudan sonra, yataktan kalkmadan, konuşmadan ve su içmeden yapın. Ölçüm yerini (ağız, vajinal veya rektal) döngü boyunca değiştirmeyin.',
        'Adım 3 - Kaydetme: Değeri hemen uygulamaya girin. Grafiğe ek olarak servikal mukus niteliğini, ilişki günlerini, uyku bozukluğunu, alkol tüketimini ve hastalık durumunu not edin; bu notlar sapmaları yorumlamanızı sağlar.',
        'Adım 4 - Yorumlama: Ardışık üç ölçümün, önceki altı günün en yüksek değerinden belirgin şekilde yüksek olması "sıcaklık kayması" olarak kabul edilir. Ovülasyon genellikle bu yükselişin bir gün öncesinde gerçekleşmiştir. Yükselişin 18 günden uzun sürmesi gebelik olasılığını düşündürür.',
        'Adım 5 - Luteal evreyi ölçün: Sıcaklık kaymasından adetin ilk gününe kadar geçen süre luteal evredir. Tekrarlayan biçimde 10 günün altında olması luteal yetmezlik açısından hekim değerlendirmesi gerektirir.',
        'Sınırlamalar: BBT geriye dönük bilgi verir, yani doğurganlık penceresini önceden göstermez. Ateşli hastalık, alkol, vardiyalı çalışma, düzensiz uyku ve bazı ilaçlar ölçümü bozar. Bu nedenle BBT en iyi sonucu servikal mukus takibi veya LH testleriyle birlikte kullanıldığında verir.',
        'Grafiğinizi hekiminize götürün: 2-3 döngülük düzenli tutulmuş bir BBT grafiği; anovülasyon, kısa luteal evre veya düzensiz döngü şüphesinde hekiminizin tanıya ulaşmasını hızlandıran somut bir veri kaynağıdır.',
      ],
      tags: ['BBT', 'Bazal Sıcaklık', 'Ovülasyon Doğrulama', 'Luteal Evre'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Ceyda Aksoy',
    },
    {
      id: 'art-18',
      title: 'Endometriozis ve Doğurganlık',
      subtitle: 'Ağrının ötesinde: gebe kalma sürecine etkisi ve tedavi seçenekleri',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Prof. Dr. Melis Erdem',
      authorTitle: 'Kadın Hastalıkları ve Üreme Cerrahisi Uzmanı',
      readTime: '8 dk',
      hasAudio: false,
      summary: 'Endometriozis üreme çağındaki kadınların yaklaşık %10\'unu etkiler. Doğurganlığı azaltabilir ancak endometriozisi olan kadınların çoğu gebe kalabilir.',
      content: [
        'Endometriozis, rahim iç zarına benzer dokunun rahim dışında (yumurtalıklar, karın zarı, bağırsak yüzeyi, tüpler) yerleşmesidir. Bu odaklar her döngüde hormonal uyarıya yanıt verir, kanar ve kronik inflamasyon ile yapışıklıklara yol açar.',
        'Tipik belirtiler: Ağrı kesiciye yanıt vermeyen şiddetli adet sancısı, cinsel ilişki sırasında derin ağrı, tuvalet alışkanlığına eşlik eden ağrı, kronik pelvik ağrı ve yorgunluk. Ancak hastalığın yaygınlığı ile ağrının şiddeti her zaman paralel gitmez; bazı kadınlarda tek bulgu gebe kalamamaktır.',
        'Doğurganlığı nasıl etkiler? Birden fazla mekanizma söz konusudur: yapışıklıkların tüplerin hareketini ve yumurta yakalama işlevini bozması, inflamatuvar ortamın sperm ile yumurta buluşmasını ve implantasyonu olumsuz etkilemesi, yumurtalık kistleri (endometrioma) nedeniyle yumurtalık rezervinin azalması.',
        'Tanı: Ayrıntılı öykü, jinekolojik muayene ve ultrason ilk adımdır. Derin yerleşimli odaklar için MR kullanılır. Kesin tanı laparoskopiyle konur; ancak günümüzde yalnızca tanı amacıyla cerrahi yapmak yerine, klinik bulgularla tedaviye başlanması yaygın yaklaşımdır.',
        'Gebelik planı olmayan dönemde tedavi ağrı kontrolüne odaklanır: NSAİİ, kombine oral kontraseptifler veya progestin içeren yöntemler. Ancak bu hormonal tedaviler ovülasyonu baskıladığı için gebelik denenen dönemde uygun değildir; bu ayrımı hekiminizle netleştirmeniz önemlidir.',
        'Gebelik hedefi varsa: Hafif-orta endometriozis olgularında laparoskopik odak temizliği kendiliğinden gebelik şansını artırabilir. Yumurtalık rezervi düşükse veya tüplerde ciddi hasar varsa doğrudan tüp bebek (IVF) tedavisine geçmek daha etkilidir. Endometrioma cerrahisi rezervi azaltabileceği için karar, kist boyutu ve yaşa göre bireysel verilir.',
        'Yumurtalık rezervi takibi: AMH ölçümü ve antral folikül sayımı, özellikle geçirilmiş yumurtalık cerrahisi olanlarda planlamayı yönlendirir. Gebeliği erteleyecek genç hastalarda yumurta dondurma seçeneği konuşulmalıdır.',
        'Destekleyici yaklaşımlar: Anti-inflamatuvar ağırlıklı beslenme (omega-3, sebze-meyve zenginliği), düzenli egzersiz, pelvik taban fizyoterapisi ve ağrı yönetiminde psikolojik destek yaşam kalitesini belirgin biçimde iyileştirir. Bu yöntemler tıbbi tedavinin yerini almaz, onu tamamlar.',
        'Ne zaman uzmana? Adet ağrısı günlük yaşamınızı aksatıyorsa veya 6-12 aydır gebe kalamıyorsanız endometriozis deneyimi olan bir merkeze başvurmak tanı gecikmesini önler.',
      ],
      tags: ['Endometriozis', 'Pelvik Ağrı', 'İnfertilite', 'Laparoskopi'],
      reviewedBy: 'Tıp Kurulu Onaylı • Prof. Dr. Melis Erdem',
    },
    {
      id: 'art-19',
      title: 'Gebelik Testi Ne Zaman ve Nasıl Yapılır?',
      subtitle: 'hCG mantığı, doğru zamanlama ve silik çizgiyi yorumlamak',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Dr. Zeynep Kaya',
      authorTitle: 'Kadın Hastalıkları ve Doğum Uzmanı',
      readTime: '5 dk',
      hasAudio: false,
      summary: 'Gebelik testleri hCG hormonunu ölçer. Doğru sonuç için zamanlama, idrar yoğunluğu ve testin duyarlılığı belirleyicidir.',
      content: [
        'Gebelik testleri, embriyonun rahme tutunmasından sonra salgılanan insan koryonik gonadotropin (hCG) hormonunu tespit eder. hCG düzeyi erken gebelikte her 48-72 saatte yaklaşık iki katına çıkar; bu yüzden bir gün erken yapılan test negatif çıkarken iki gün sonra pozitifleşebilir.',
        'En doğru zaman: Beklenen adet tarihinin ilk günü veya sonrası. Bu, ovülasyondan yaklaşık 14 gün sonrasına denk gelir. Duyarlılığı yüksek testler (10-25 mIU/mL) adet gecikmesinden 2-3 gün önce sonuç verebilir, ancak yanlış negatif oranı bu dönemde yüksektir.',
        'Nasıl yapılır: Sabahın ilk idrarı hCG açısından en yoğundur, bu nedenle erken testlerde tercih edilir. Test çubuğunu üretici talimatındaki süre kadar idrara tutun, yatay bir yüzeye koyun ve belirtilen dakika aralığında okuyun. Çok geç okunan testlerde buharlaşma çizgisi yanıltıcı olabilir.',
        'Silik çizgi ne demek? Kontrol çizgisinin yanında beliren en soluk çizgi bile, belirtilen okuma süresi içinde göründüyse genellikle pozitiftir. Emin olmak için 48 saat sonra testi tekrarlayın; gerçek gebelikte çizgi belirgin şekilde koyulaşır.',
        'Yanlış negatif nedenleri: Çok erken test yapmak, aşırı sıvı tüketimiyle seyrelmiş idrar, son kullanma tarihi geçmiş test, yumurtlamanın sanılandan geç olması. Adetiniz gecikiyor ve test negatifse 3-4 gün sonra tekrarlayın.',
        'Yanlış pozitif nedenleri: hCG içeren doğurganlık tedavileri, çok erken kayıp (kimyasal gebelik), nadiren bazı tıbbi durumlar. Şüpheli durumlarda kan testi (beta-hCG) kesin sonuç verir ve düzeyin artış hızını gösterir.',
        'Pozitif sonuçtan sonra: Folik asit kullanımına devam edin, sigara ve alkolü tamamen bırakın, reçetesiz ilaç kullanmadan önce hekiminize danışın. İlk ultrason için genellikle 6-8. haftalar arası randevu planlanır; şiddetli tek taraflı ağrı veya yoğun kanama varsa acil değerlendirme gerekir.',
      ],
      tags: ['Gebelik Testi', 'hCG', 'Beta hCG', 'Adet Gecikmesi'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Zeynep Kaya',
    },
    {
      id: 'art-20',
      title: 'Düşük Sonrası Yeniden Denemek',
      subtitle: 'Fiziksel iyileşme, duygusal süreç ve doğru zamanlama',
      category: 'conception',
      categoryName: 'Gebe Kalma & Doğurganlık',
      author: 'Dr. Selin Demir',
      authorTitle: 'Perinatoloji ve Kadın Doğum Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'Gebeliklerin yaklaşık %10-20\'si erken düşükle sonuçlanır ve çoğu nedeni önlenemez kromozom hatalarıdır. Yeniden denemek için bedenin ve duyguların hazır olması gerekir.',
      content: [
        'Erken gebelik kaybının en sık nedeni, embriyoda rastgele oluşan kromozom anomalileridir. Bu, annenin yaptığı bir hatanın sonucu değildir; kaldırdığınız bir çanta, içtiğiniz bir kahve veya yaşadığınız stres tek başına düşüğe neden olmaz. Bu gerçeği bilmek suçluluk duygusunu hafifletmede ilk adımdır.',
        'Fiziksel iyileşme: Kanama genellikle 1-2 hafta içinde azalır. hCG düzeyinin sıfırlanması 2-6 hafta sürebilir; bu süre boyunca gebelik testi pozitif çıkmaya devam edebilir. Yumurtlama, çoğu kadında kayıptan 2-4 hafta sonra tekrar başlar ve ilk adet 4-6 hafta içinde gelir.',
        'Ne zaman yeniden denenebilir? Enfeksiyon riskini azaltmak için kanama tamamen bitene kadar cinsel ilişkiden kaçınılması önerilir. Güncel veriler, komplike olmayan erken kayıplardan sonra bir sonraki döngüde denemeye başlamanın riski artırmadığını, bazı çalışmalarda daha iyi sonuçlarla ilişkili olduğunu göstermektedir. Yine de kişisel karar, kürtaj/küretaj gibi girişim yapılıp yapılmadığına ve hekiminizin önerisine göre şekillenir.',
        'Duygusal süreç: Yas, gebeliğin süresiyle ölçülmez. Üzüntü, öfke, boşluk hissi ve sonraki gebelikte kaygı normaldir. Partnerlerin yas tepkileri farklı hızlarda olabilir; bunu bir ilgisizlik olarak yorumlamamak ilişkiyi korur. Belirtiler 2 aydan uzun sürüyor, işlevselliği bozuyorsa psikolojik destek almak güçlü bir adımdır.',
        'Hangi durumda araştırma yapılır? Ardışık iki veya üç kayıptan sonra "tekrarlayan gebelik kaybı" değerlendirmesi başlatılır. İncelemeler tiroid fonksiyonları, prolaktin, kan şekeri, antifosfolipid antikorları, rahim anatomisi (histeroskopi/ultrason) ve çift için karyotip analizini içerebilir. Buna karşın olguların yarısında net bir neden bulunamaz ve bu grupta sonraki gebelik şansı yine yüksektir.',
        'Sonraki gebeliğe hazırlık: Folik asit takviyesine kesintisiz devam edin, tiroid ve D vitamini düzeylerini kontrol ettirin, sigara ve alkolü bırakın, kilo ve kan şekeri dengesini gözden geçirin. Kronik hastalıklar (diyabet, tiroid, hipertansiyon) gebelik öncesi düzenlenmelidir.',
        'İstatistiksel gerçek: Tek bir erken kayıp yaşamış kadınların büyük çoğunluğu, sonraki gebelikte sağlıklı bir bebek dünyaya getirir. Üç kayıp sonrasında bile canlı doğum şansı ciddi biçimde korunur. Bu süreçte kendinize karşı şefkatli olmak, sürecin tıbbi kısmı kadar önemlidir.',
      ],
      tags: ['Düşük', 'Gebelik Kaybı', 'Yas', 'Yeniden Deneme'],
      reviewedBy: 'Tıp Kurulu Onaylı • Dr. Selin Demir',
    },
    {
      id: 'art-21',
      title: 'Tiroid Hormonları ve Döngü İlişkisi',
      subtitle: 'TSH, hipotiroidi, hashimoto ve doğurganlık üzerindeki etkileri',
      category: 'cycle',
      categoryName: 'Döngü & Hormonlar',
      author: 'Doç. Dr. Nazlı Ateş',
      authorTitle: 'Endokrinoloji ve Metabolizma Hastalıkları Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'Tiroid, adet döngüsünün sessiz düzenleyicisidir. Hafif bir işlev bozukluğu bile düzensiz döngü, ovülasyon sorunları ve gebelik kaybı riskiyle ilişkilendirilir.',
      content: [
        'Tiroid hormonları (T3 ve T4), hücresel metabolizmanın hızını belirler ve hipotalamus-hipofiz-yumurtalık ekseniyle sıkı bir etkileşim içindedir. Bu nedenle tiroid işlev bozuklukları doğrudan adet düzenini ve doğurganlığı etkiler.',
        'Hipotiroidi (yavaş çalışan tiroid): Yorgunluk, kilo alımı, soğuğa dayanamama, kabızlık, saç dökülmesi, cilt kuruluğu ve depresif ruh hali görülür. Döngü açısından uzun süreli veya aşırı kanama (menoraji), döngü uzaması ve ovülasyon yokluğu tipiktir. Yükselen TRH, prolaktin salgısını da artırarak ovülasyonu ayrıca baskılayabilir.',
        'Hipertiroidi (hızlı çalışan tiroid): Çarpıntı, kilo kaybı, terleme, titreme, uykusuzluk ve kaygı ön plandadır. Döngüde ise seyrek ve hafif kanama (oligomenore) ya da adetin tamamen kesilmesi görülebilir.',
        'Hashimoto tiroiditi: Türkiye\'de hipotiroidinin en sık nedenidir. Anti-TPO ve anti-Tg antikorlarının varlığı, TSH normal olsa bile gebelik kaybı riskinde hafif artışla ilişkilendirilmiştir; bu nedenle takip aralıkları sıklaştırılır.',
        'Hangi testler? Değerlendirme TSH ile başlar; gerekirse serbest T4, serbest T3 ve tiroid antikorları eklenir. Düzensiz döngü, açıklanamayan infertilite, tekrarlayan gebelik kaybı veya ailede tiroid hastalığı öyküsü varsa test yapılması önerilir.',
        'Gebelik hedefi olan kadınlarda hedef değerler daha sıkıdır. Gebelikte tiroid hormonu ihtiyacı ilk trimesterde belirgin şekilde artar ve levotiroksin dozu genellikle yükseltilir. Gebelik doğrulandığında hekiminizle hemen iletişime geçmeniz ve doz ayarı için tetkik planlamanız gerekir; bebeğin beyin gelişimi ilk haftalarda tamamen anne tiroid hormonuna bağlıdır.',
        'Beslenme ve iyot: Tiroid hormon üretimi iyot gerektirir; iyotlu tuz kullanımı bu ihtiyacı karşılamada temel yoldur. Ancak yüksek doz iyot takviyesi tiroidi baskılayabilir, bu nedenle hekim önerisi olmadan alınmamalıdır. Selenyum ve D vitamini düzeyleri de değerlendirmeye dahil edilir.',
        'İlaç kullanımında pratik nokta: Levotiroksin aç karnına, en az 30-60 dakika yemekten önce alınmalı; demir, kalsiyum takviyeleri ve kahve ile arasında 4 saat bırakılmalıdır. Aksi hâlde emilim düşer ve tedavi yetersiz kalır.',
      ],
      tags: ['Tiroid', 'TSH', 'Hashimoto', 'Döngü Düzensizliği'],
      reviewedBy: 'Tıp Kurulu Onaylı • Doç. Dr. Nazlı Ateş',
    },
    {
      id: 'art-22',
      title: 'Doğurganlık İçin Beslenme: Akdeniz Diyeti Yaklaşımı',
      subtitle: 'Kan şekeri dengesi, sağlıklı yağlar ve gebelik öncesi tabak modeli',
      category: 'fitness',
      categoryName: 'Beslenme & Egzersiz',
      author: 'Uzm. Dyt. Selin Yıldız',
      authorTitle: 'Klinik Beslenme Uzmanı',
      readTime: '7 dk',
      hasAudio: false,
      summary: 'Akdeniz tipi beslenme, doğurganlık üzerinde en güçlü bilimsel desteğe sahip modeldir; hem ovülasyon kalitesini hem sperm sağlığını olumlu etkiler.',
      content: [
        'Akdeniz diyeti; zeytinyağı, sebze-meyve, tam tahıl, baklagil, kuruyemiş, balık ve az miktarda süt ürününe dayanan bir beslenme örüntüsüdür. Gözlemsel çalışmalar bu örüntüye yakın beslenen çiftlerde gebe kalma sürelerinin daha kısa, yardımcı üreme tedavilerinde başarı oranlarının daha yüksek olduğunu göstermektedir.',
        'Neden işe yarıyor? Temel mekanizma inflamasyonun azalması ve insülin duyarlılığının artmasıdır. Dengeli kan şekeri, yumurtalıklarda androjen üretimini normalleştirir ve düzenli ovülasyonu destekler. Antioksidan yoğunluğu ise hem yumurta hem sperm DNA\'sını oksidatif hasara karşı korur.',
        'Tabak modeli: Öğünlerinizin yarısını renkli sebzeler, dörtte birini kaliteli protein (balık, baklagil, yumurta, tavuk), dörtte birini kompleks karbonhidrat (bulgur, tam tahıllı ekmek, kinoa) oluştursun. Üzerine 1-2 yemek kaşığı zeytinyağı ekleyin. Bu düzen tokluk süresini uzatır ve öğün sonrası kan şekeri dalgalanmasını azaltır.',
        'Öne çıkan besinler: Haftada 2 porsiyon yağlı balık (somon, sardalya, hamsi) omega-3 sağlar. Mercimek ve nohut hem bitkisel protein hem folat kaynağıdır. Ceviz, badem ve kabak çekirdeği çinko ve E vitamini içerir. Koyu yeşil yapraklılar folat ve demir açısından zengindir; C vitamini kaynağıyla birlikte tüketildiğinde demir emilimi artar.',
        'Sınırlanması gerekenler: Şekerli içecekler, beyaz un ürünleri, işlenmiş etler (sucuk, salam), trans yağ içeren hazır ürünler ve aşırı kızartma. Yüksek cıva içeriği nedeniyle kılıç balığı, köpek balığı ve büyük ton balığı gebelik planlanan dönemde tercih edilmemelidir.',
        'Kafein ve alkol: Kafeini günde 200 mg (yaklaşık 1-2 fincan) altında tutmak makul bir sınırdır. Alkol için gebelik planlanan dönemde en güvenli miktar sıfırdır, çünkü gebeliğin ilk haftaları çoğu zaman fark edilmeden geçer.',
        'Takviyeler: Folik asit (günlük 400 mcg, en az 1-3 ay önce başlanarak) tek başına kanıtı en güçlü takviyedir. D vitamini, B12 (özellikle vejetaryen/vegan beslenenlerde), iyot ve gerekirse demir kan değerlerine göre planlanır. Multivitaminler beslenmenin yerini almaz; "doğurganlık çayı" gibi düzenlenmemiş ürünlerden uzak durun.',
        'Kilo dengesi: Hem çok yüksek hem çok düşük vücut yağ oranı ovülasyonu bozar. Aşırı kısıtlayıcı diyetler ve yoğun egzersiz kombinasyonu hipotalamik amenoreye yol açabilir. Hedef, hızlı kilo değişimi değil sürdürülebilir ve yeterli enerji alımıdır.',
        'Partner de dahil olsun: Sperm parametreleri de aynı beslenme örüntüsünden fayda görür. Mutfağı ortak bir proje hâline getirmek, değişikliğin kalıcı olma şansını belirgin biçimde artırır.',
      ],
      tags: ['Akdeniz Diyeti', 'Doğurganlık', 'Beslenme', 'Folik Asit'],
      reviewedBy: 'Tıp Kurulu Onaylı • Uzm. Dyt. Selin Yıldız',
    },
  ];

  private faqs = [
    {
      id: 'faq-1',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      question: 'Hamileliğin ilk haftalarında hafif lekelenme (yerleşme kanaması) normal midir?',
      answer: 'Evet, döllenen yumurtanın rahim iç zarına tutunması (implantasyon) sırasında pembe veya açık kahverengi hafif lekelenmeler yaşanabilir. Buna yerleşme kanaması denir ve genellikle adetten daha kısa ve hafiftir. Ancak şiddetli kasık ağrısı veya parlak kırmızı yoğun kanama eşlik ediyorsa mutlaka hekime başvurulmalıdır.',
      doctor: 'Dr. Zeynep Kaya (Kadın Hastalıkları ve Doğum Uzmanı)',
    },
    {
      id: 'faq-2',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      question: 'Hamilelikte sabah bulantıları ne zaman başlar ve ne zaman hafifler?',
      answer: 'Sabah bulantıları genellikle 5. veya 6. haftada başlar, 9. haftada en üst seviyeye ulaşır ve 12-14. haftalarda (ikinci trimestere girerken) belirgin şekilde azalır. Yataktan kalkmadan tuzlu kraker atıştırmak, zencefil çayı ve az az sık sık beslenmek bulantıyı hafifletmeye yardımcı olur.',
      doctor: 'Dr. Zeynep Kaya (Kadın Hastalıkları ve Doğum Uzmanı)',
    },
    {
      id: 'faq-3',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Gebe kalma şansını en çok artıran günler hangileridir?',
      answer: 'Yumurtlama gününden önceki 3-5 gün ile yumurtlama gününün kendisi "doğurganlık penceresi"dir. Sperm kadın vücudunda 3 ila 5 gün canlı kalabilirken, yumurta yalnızca 12-24 saat yaşar. Bu nedenle yumurtlamadan 2 gün önce ve yumurtlama günü yaşanan birliktelik gebe kalma şansını en tepeye çıkarır.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-4',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Servikal akıntı takibi yumurtlamayı nasıl gösterir?',
      answer: 'Yumurtlamaya yaklaştıkça artan östrojen hormonu sayesinde vajinal akıntı şeffaflaşır, kayganlaşır ve iki parmak arasında uzayan çiğ yumurta akı kıvamını alır. Bu akıntıyı gördüğünüz günler hamilelik için en verimli döneminizdir.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-5',
      category: 'cycle',
      categoryName: 'Döngü & Regl',
      question: 'Döngümün birkaç gün gecikmesi veya erken gelmesi normal midir?',
      answer: 'Evet. İdeal bir adet döngüsü 21 ila 35 gün arasında değişir. Stres, mevsim geçişleri, seyahat, uyku düzensizlikleri veya ani kilo değişimleri döngüyü 3-7 gün öne veya geriye çekebilir. 3 aydan uzun süren düzensizliklerde hormon paneli kontrol edilmelidir.',
      doctor: 'Dr. Ceyda Aksoy (Kadın Sağlığı Uzmanı)',
    },
    {
      id: 'faq-6',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      question: 'Gerçek doğum sancısı (kasılma) ile yalancı sancı (Braxton Hicks) nasıl ayırt edilir?',
      answer: 'Braxton Hicks sancıları düzensizdir, pozisyon değiştirdiğinizde veya dinlendiğinizde geçer ve şiddeti artmaz. Gerçek doğum sancıları ise düzenli aralıklarla gelir (örneğin her 5 dakikada bir), giderek sıklaşır, süresi 45-60 saniyeye uzar ve dinlenmekle geçmez.',
      doctor: 'Dr. Zeynep Kaya (Kadın Hastalıkları ve Doğum Uzmanı)',
    },
    {
      id: 'faq-7',
      category: 'wellness',
      categoryName: 'Beslenme & Vitaminler',
      question: 'Folik asit kullanımına ne zaman başlanmalı ve ne kadar sürdürülmeli?',
      answer: 'Folik asit, bebeğin nöral tüp defektlerini (omurilik ve beyin anomalileri) önlemek için gebelik planlanmaya başlandığı andan (en az 1-3 ay önce) itibaren günlük 400 mcg olarak alınmalıdır ve gebeliğin en az 12. haftasına kadar devam ettirilmelidir.',
      doctor: 'Uzm. Dyt. Selin Yıldız (Klinik Beslenme Uzmanı)',
    },
    {
      id: 'faq-8',
      category: 'pregnancy',
      categoryName: 'Hamilelik & Doğum',
      question: 'Bebeğin ilk tekmeleri ve hareketleri ne zaman hissedilir?',
      answer: 'İlk gebeliklerde tekmeler genellikle 18 ile 22. haftalar arasında kelebek kanat çırpması veya gaz kabarcığı gibi hissedilir. Daha önce doğum yapmış anneler bu hareketleri 16. haftadan itibaren daha erken fark edebilir.',
      doctor: 'Dr. Zeynep Kaya (Kadın Hastalıkları ve Doğum Uzmanı)',
    },
    {
      id: 'faq-9',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Doğurganlık penceresi nedir ve nasıl hesaplanır?',
      answer: 'Doğurganlık penceresi, gebe kalmanın mümkün olduğu 6 günlük dönemdir: yumurtlamadan önceki 5 gün ve yumurtlama günü. Bu aralık, spermin kadın üreme kanalında 3-5 gün canlı kalabilmesinden kaynaklanır; yumurta ise yalnızca 12-24 saat döllenebilir. Kabaca hesaplamak için ortalama döngü uzunluğunuzdan 14 çıkarın; 28 günlük bir döngüde yumurtlama yaklaşık 14. güne, pencere ise 9-14. günlere denk gelir. Daha net sonuç için servikal mukus takibi, LH stripleri ve bazal vücut sıcaklığı gibi yöntemleri birlikte kullanmak gerekir. Döngüsü düzensiz olanlarda takvim hesabı güvenilir değildir; bu kişilerde vücut belirtilerini izlemek çok daha doğrudur.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-10',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Her ay yumurtlar mıyım?',
      answer: 'Düzenli döngüsü olan sağlıklı kadınların çoğu her ay yumurtlar, ancak yılda bir veya iki döngünün yumurtlamasız (anovülatuvar) geçmesi normal kabul edilir. Yoğun stres, ani kilo değişimi, aşırı egzersiz, uzun seyahatler, tiroid sorunları ve PCOS yumurtlamayı engelleyebilir. Adet benzeri bir kanama olması, o döngüde yumurtladığınızı kanıtlamaz; hormonal geri çekilme kanaması da benzer görünebilir. Yumurtlamayı doğrulamanın pratik yolları, bazal vücut sıcaklığında kalıcı yükseliş görmek veya döngünün 21. günü civarında progesteron ölçümü yapmaktır. Döngüleriniz 21 günden kısa, 35 günden uzun veya çok değişkense hekim değerlendirmesi önerilir.',
      doctor: 'Dr. Ceyda Aksoy (Kadın Sağlığı Uzmanı)',
    },
    {
      id: 'faq-11',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Ne sıklıkla ilişkiye girmeliyim?',
      answer: 'Doğurganlık penceresinde gün aşırı veya her gün ilişki en yüksek gebelik şansını sağlar; ikisi arasında anlamlı bir fark gösterilmemiştir. Günlük ilişki sperm sayısını klinik olarak önemli ölçüde düşürmez, dolayısıyla "sperm biriktirmek" için uzun perhiz yapmak gereksizdir ve hatta sperm DNA kalitesini olumsuz etkileyebilir. Ovülasyon gününü tam olarak bilemiyorsanız, döngü boyunca haftada 2-3 kez düzenli birliktelik pencereyi kaçırmamanın en pratik yoludur. Cinselliği bir takvim görevine dönüştürmek çiftler için önemli bir stres kaynağı olabilir; bu yüzden esnek bir düzen kurmak sürdürülebilirlik açısından daha sağlıklıdır.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-12',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'İlişki sonrası bekleme veya bacakları yukarı kaldırma pozisyonu işe yarar mı?',
      answer: 'Spermlerin en hızlıları boşalmadan sonra dakikalar içinde rahim ağzından geçerek fallop tüplerine ulaşır, dolayısıyla yer çekimi belirleyici bir faktör değildir. Belirli bir cinsel pozisyonun gebelik şansını artırdığını gösteren güvenilir bilimsel kanıt bulunmamaktadır. İlişkiden sonra 10-15 dakika uzanmak zararlı değildir ve rahatlatıcı olabilir; ancak bacakları duvara dayamak gibi uygulamalar gereksizdir. Sıvının bir kısmının dışarı akması tamamen normaldir ve gebe kalamayacağınız anlamına gelmez. Aynı şekilde ilişki sonrası vajinal duş yapmak hem gereksiz hem de vajinal florayı bozduğu için önerilmez.',
      doctor: 'Dr. Ceyda Aksoy (Kadın Sağlığı Uzmanı)',
    },
    {
      id: 'faq-13',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Ovülasyon ağrısı normal mi?',
      answer: 'Evet, kadınların yaklaşık beşte biri yumurtlama sırasında tek taraflı, kısa süreli bir kasık ağrısı hisseder; buna Almanca kökenli bir terimle Mittelschmerz denir. Ağrı, folikülün çatlaması ve az miktarda sıvı ile kanın karın zarını tahriş etmesinden kaynaklanır ve genellikle birkaç saatten bir güne kadar sürer. Ağrının hangi tarafta olduğu o ay hangi yumurtalığın çalıştığını gösterir ve aylar arasında değişebilir. Basit ağrı kesiciler ve sıcak uygulama çoğu zaman yeterlidir. Ancak ağrı şiddetli, 2-3 günden uzun süren, ateş, kusma, baygınlık hissi veya anormal kanamayla birlikteyse over kisti torsiyonu, apandisit veya ektopik gebelik gibi durumları ayırt etmek için acil değerlendirme gerekir.',
      doctor: 'Dr. Zeynep Kaya (Kadın Hastalıkları ve Doğum Uzmanı)',
    },
    {
      id: 'faq-14',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Gebe kalamıyorsam kaç ay sonra doktora gitmeliyim?',
      answer: 'Genel kural, 35 yaşın altındaki çiftlerin 12 ay düzenli ve korunmasız denemeden sonra, 35-39 yaş aralığında 6 ay sonra, 40 yaş ve üzerinde ise beklemeden başvurmasıdır. Bazı durumlarda ise süre beklenmeden değerlendirme yapılmalıdır: adet düzensizliği veya hiç adet görmeme, bilinen PCOS veya endometriozis tanısı, geçirilmiş pelvik enfeksiyon ya da karın ameliyatı, iki ve üzeri gebelik kaybı, kemoterapi öyküsü veya erkek partnerde testis cerrahisi/travma öyküsü. İlk değerlendirme genellikle hormon testleri, ultrason ve erkek için spermiyogramdan oluşur; ikisi birlikte istenir çünkü infertilitenin yaklaşık yarısında erkek faktörü de rol oynar. Erken başvuru, tedavi seçeneklerini daraltmak yerine genişletir.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-15',
      category: 'wellness',
      categoryName: 'Beslenme & Vitaminler',
      question: 'Folik asidi ne zaman başlamalıyım ve dozu ne olmalı?',
      answer: 'Folik asit, gebelik planlamaya başladığınız andan itibaren, yani döllenmeden en az 1-3 ay önce alınmaya başlanmalıdır. Bebeğin nöral tüpü (beyin ve omurilik taslağı) gebeliğin ilk 4-6 haftasında kapanır ve bu genellikle kişi gebe olduğunu henüz bilmezken gerçekleşir; bu nedenle "test pozitif çıkınca başlarım" yaklaşımı geç kalır. Standart doz günlük 400 mikrogramdır ve gebeliğin en az 12. haftasına kadar sürdürülür. Daha önce nöral tüp defektli bir gebelik geçirenlerde, diyabet, epilepsi ilacı kullanımı, obezite veya emilim bozukluğu olanlarda hekim daha yüksek doz önerebilir; bu artışı kendi başınıza yapmayın. Mercimek, nohut, koyu yeşil yapraklı sebzeler ve portakal iyi folat kaynaklarıdır ancak tek başına diyet önerilen düzeyi güvenilir biçimde sağlamaz.',
      doctor: 'Uzm. Dyt. Selin Yıldız (Klinik Beslenme Uzmanı)',
    },
    {
      id: 'faq-16',
      category: 'wellness',
      categoryName: 'Beslenme & Vitaminler',
      question: 'Kahve ve alkol doğurganlığı etkiler mi?',
      answer: 'Günde 200 mg\'a kadar kafein (yaklaşık 1-2 fincan filtre kahve) gebe kalma şansını olumsuz etkilemez ve gebelikte de güvenli sınır olarak kabul edilir. Daha yüksek tüketim bazı çalışmalarda gebe kalma süresinin uzaması ve düşük riskinde hafif artışla ilişkilendirilmiştir; enerji içecekleri, yeşil çay ve bitter çikolatanın da kafein içerdiğini hesaba katmak gerekir. Alkol için durum farklıdır: yoğun ve düzenli alkol tüketimi kadınlarda ovülasyonu, erkeklerde testosteron ve sperm kalitesini bozar. Gebeliğin ilk haftaları çoğu zaman fark edilmediği için gebelik planlanan dönemde en güvenli miktar sıfırdır. Sigaranın etkisi ise her ikisinden daha güçlüdür; yumurtalık rezervini azaltır ve menopozu öne çeker.',
      doctor: 'Uzm. Dyt. Selin Yıldız (Klinik Beslenme Uzmanı)',
    },
    {
      id: 'faq-17',
      category: 'wellness',
      categoryName: 'Beslenme & Vitaminler',
      question: 'Kilo doğurganlığı nasıl etkiler?',
      answer: 'Yağ dokusu östrojen üreten aktif bir organ gibi davrandığı için hem fazla hem de çok az vücut yağı hormonal dengeyi bozar. Vücut kitle indeksinin 30\'un üzerinde olması insülin direncini artırarak yumurtlamayı düzensizleştirir, gebelik diyabeti ve preeklampsi riskini yükseltir. Diğer uçta, VKİ\'nin 18,5 altına inmesi veya çok düşük yağ oranıyla birlikte yoğun egzersiz, hipotalamik amenoreye yani yumurtlamanın tamamen durmasına yol açabilir. İyi haber şu ki fazla kilosu olan kadınlarda vücut ağırlığının yalnızca %5-10\'unu kaybetmek, birçok vakada kendiliğinden ovülasyonu geri getirir. Erkeklerde de obezite sperm sayısını ve hareketliliğini düşürür, dolayısıyla değişikliği çift olarak yapmak daha etkilidir. Hedef hızlı kilo kaybı değil, sürdürülebilir ve besleyici bir düzen olmalıdır.',
      doctor: 'Uzm. Dyt. Selin Yıldız (Klinik Beslenme Uzmanı)',
    },
    {
      id: 'faq-18',
      category: 'cycle',
      categoryName: 'Döngü & Regl',
      question: 'Adet düzensizliği kısırlık mı demek?',
      answer: 'Hayır, düzensiz adet kısırlık anlamına gelmez ancak yumurtlamanın her ay düzenli gerçekleşmediğine dair önemli bir ipucudur ve gebe kalma süresini uzatabilir. En sık nedenler PCOS, tiroid işlev bozukluğu, yüksek prolaktin, aşırı stres, ani kilo değişimi ve yoğun egzersizdir; bunların çoğu tedavi edilebilir durumlardır. Düzensiz döngüde takvim yöntemiyle yumurtlama gününü tahmin etmek güvenilir olmadığından, servikal mukus takibi ve LH stripleri daha yararlıdır. Döngüleriniz sürekli 21 günden kısa, 35 günden uzun ya da aylar arasında 8-10 günden fazla değişkenlik gösteriyorsa hormon paneli ve ultrason ile değerlendirme yapılmalıdır. Altta yatan neden düzeltildiğinde birçok kadında ovülasyon ve gebelik şansı normale döner.',
      doctor: 'Dr. Ceyda Aksoy (Kadın Sağlığı Uzmanı)',
    },
    {
      id: 'faq-19',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Doğum kontrol hapını bıraktıktan sonra ne kadar sürede gebe kalınır?',
      answer: 'Kombine doğum kontrol haplarının etkisi hızla geçer; çoğu kadın ilk 1-3 ay içinde yumurtlamaya yeniden başlar ve bir yıl içindeki gebelik oranları hiç hap kullanmamış kadınlarla benzerdir. Hap uzun süreli kullanımda yumurtalık rezervini azaltmaz veya kalıcı kısırlık yapmaz. Yöntemler arasında fark vardır: hormonlu rahim içi araç ve implant çıkarıldıktan sonra ovülasyon çok hızlı döner, buna karşın üç aylık iğne (depo enjeksiyon) sonrası yumurtlamanın normale dönmesi 6-12 ayı bulabilir. İlk birkaç döngünün düzensiz olması ve gerçek döngü uzunluğunuzun ancak birkaç ay sonra netleşmesi beklenen bir durumdur. Gebelik planlıyorsanız folik asit takviyesine hap bırakılmadan önce başlamak en doğru zamanlamadır.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-20',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Yaş doğurganlığı nasıl etkiler?',
      answer: 'Kadın doğurganlığı, yumurta sayısı ve kalitesine bağlı olarak yaşla birlikte azalır; düşüş 32 yaş civarında hafifçe başlar, 37 yaşından sonra belirgin biçimde hızlanır. Yaşla artan kromozom anomalisi oranı, hem gebe kalma süresini uzatır hem de düşük riskini yükseltir. AMH düzeyi ve antral folikül sayımı yumurtalık rezervi hakkında bilgi verir ancak bunlar yumurta kalitesini veya belirli bir ay içinde gebe kalma şansınızı ölçmez; bu testlerin sonucunu tek başına bir kader olarak okumak yanlıştır. Erkeklerde düşüş daha yavaştır fakat 45 yaş sonrası sperm DNA hasarı ve gebeliğe ulaşma süresi artar. Gebeliği erteleme planı varsa, yumurta dondurma seçeneğini 35 yaşından önce bir üreme sağlığı uzmanıyla konuşmak en fazla seçenek sunan yaklaşımdır.',
      doctor: 'Prof. Dr. Melis Erdem (Üreme Sağlığı Uzmanı)',
    },
    {
      id: 'faq-21',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Erkek faktörü ne kadar yaygın?',
      answer: 'İnfertilite değerlendirmelerinde erkek faktörü, olguların yaklaşık %40-50\'sinde tek başına veya kadın faktörüyle birlikte rol oynar. Bu nedenle inceleme her zaman çift olarak yapılmalıdır; yalnızca kadını araştırmak zaman kaybına yol açar. Erkek değerlendirmesinin ilk adımı olan spermiyogram basit, ucuz ve girişimsel olmayan bir testtir; öncesinde 2-5 gün cinsel perhiz gerekir. Sonuçlar sperm sayısı, hareketlilik ve şekil (morfoloji) açısından değerlendirilir ve tek bir anormal sonuç tanı koydurmaz; 2-3 hafta arayla tekrarlanır. En sık nedenler varikosel, hormonal bozukluklar, geçirilmiş enfeksiyonlar, sigara-alkol kullanımı, obezite, ısı maruziyeti ve anabolik steroid kullanımıdır. Bu nedenlerin önemli bir kısmı tedavi edilebilir ya da düzeltilebilir niteliktedir.',
      doctor: 'Doç. Dr. Emre Aydın (Üroloji ve Androloji Uzmanı)',
    },
    {
      id: 'faq-22',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Stres gebe kalmayı engeller mi?',
      answer: 'Günlük hayatın olağan stresi tek başına kısırlık nedeni değildir, dolayısıyla gebe kalamamanın sorumluluğunu "yeterince rahatlamamış olmaya" yüklemek hem yanlış hem de adaletsizdir. Ancak yoğun ve uzun süreli stres, kortizol yükselişi üzerinden GnRH salgısını baskılayarak yumurtlamayı geciktirebilir veya bir döngüyü atlatabilir. Stresin dolaylı etkileri de vardır: uyku bozulması, cinsel isteğin azalması, ilişki sıklığının düşmesi ve beslenme düzeninin bozulması. Nefes çalışmaları, düzenli fakat aşırı olmayan egzersiz, uyku hijyeni, bilişsel davranışçı terapi ve akran destek grupları bu döngüyü kırmada etkilidir. Tedavi sürecinde kaygı günlük işlevselliğinizi bozuyorsa psikolojik destek almak, sürecin tıbbi kısmı kadar meşru ve yararlı bir adımdır.',
      doctor: 'Uzm. Psk. Derya Güneş (Klinik Psikolog)',
    },
    {
      id: 'faq-23',
      category: 'fertility',
      categoryName: 'Gebe Kalma & Ovülasyon',
      question: 'Lubrikan kullanmak sorun olur mu?',
      answer: 'Kayganlaştırıcı seçimi önemlidir, çünkü su bazlı ürünlerin çoğu ile gliserin, parabenler ve yüksek ozmolalite içeren formüller laboratuvar koşullarında sperm hareketliliğini azaltır. Tükürük de sperm için uygun bir ortam değildir ve kayganlaştırıcı olarak kullanılmamalıdır. Gebelik denenen dönemde "doğurganlık dostu" (fertility-friendly) olarak etiketlenmiş, pH ve ozmolalitesi vajinal ortama ve servikal mukusa uygun ürünler ya da mineral yağ bazlı seçenekler tercih edilmelidir. Kayganlaştırıcı ihtiyacı sürekli hâle gelmişse altta yatan bir neden olabilir: doğurganlık ilaçları, emzirme dönemi, hormonal değişimler veya kaygıya bağlı yetersiz uyarılma. Bu durumda ürün değiştirmek yerine nedeni hekiminizle konuşmak daha kalıcı bir çözüm sağlar.',
      doctor: 'Dr. Ceyda Aksoy (Cinsel Sağlık ve Kadın Sağlığı Uzmanı)',
    },
  ];

  private myths = [
    {
      id: 'myth-1',
      statement: 'Regl döneminde hamile kalınması imkansızdır.',
      isTrue: false,
      explanation: 'YANLIŞ! Kısa döngülü kadınlarda (örn. 21-23 gün) erken gerçekleşen bir yumurtlama ve spermlerin kadın vücudunda 5 güne kadar yaşayabilmesi nedeniyle adet dönemindeki korunmasız ilişkiden hamile kalınabilir.',
    },
    {
      id: 'myth-2',
      statement: 'Hamilelikte iki kişilik yemek yenmelidir.',
      isTrue: false,
      explanation: 'YANLIŞ! Bebeğin ihtiyaç duyduğu kalori ilk trimesterde sıfır ekstra, ikinci trimesterde yaklaşık 340 kcal (1 kase yoğurt + meyve), üçüncü trimesterde ise yaklaşık 450 kcal fazladır. Önemli olan porsiyon büyüklüğü değil, besin kalitesidir.',
    },
    {
      id: 'myth-3',
      statement: 'Folik asit sadece hamilelik oluştuktan sonra başlanmalıdır.',
      isTrue: false,
      explanation: 'YANLIŞ! Bebeğin omurga ve sinir sistemi ilk 4-6 haftada (çoğu zaman anne hamile olduğunu anlamadan önce) kapanır. Bu sebeple gebelik planlandığı anda başlanmalıdır.',
    },
    {
      id: 'myth-4',
      statement: 'Kegel egzersizleri hem doğum kolaylığı hem de doğum sonrası toparlanma için çok etkilidir.',
      isTrue: true,
      explanation: 'DOĞRU! Pelvik taban kaslarını güçlendiren düzenli Kegel egzersizleri, doğum kaslarını kontrol etmeyi kolaylaştırır ve doğum sonrası idrar kaçırma riskini büyük ölçüde azaltır.',
    },
    {
      id: 'myth-5',
      statement: 'Kahve tüketimi hamilelikte tamamen yasaktır.',
      isTrue: false,
      explanation: 'YANLIŞ! Dünya Sağlık Örgütü ve jinekologlar, günde 200 mg kafeine kadar (yaklaşık 1 fincan filtre kahve veya 2 fincan Türk kahvesi) tüketimin güvenli olduğunu belirtmektedir.',
    },
    {
      id: 'myth-6',
      statement: 'Yumurtlama her kadında döngünün tam 14. gününde olur.',
      isTrue: false,
      explanation: 'YANLIŞ! 14. gün yalnızca 28 günlük ideal döngüler için bir ortalamadır. Yumurtlama zamanı kişiden kişiye ve aynı kişide aydan aya değişir. Değişmeyen kısım yumurtlama sonrası luteal evredir (yaklaşık 12-14 gün). Bu nedenle yumurtlama gününü tahmin etmek için döngü uzunluğunuzdan 14 çıkarmak, sabit bir 14. gün varsayımından çok daha doğrudur; en güvenilir yol ise LH testi ve servikal mukus takibidir.',
    },
    {
      id: 'myth-7',
      statement: 'Doğum kontrol hapını uzun süre kullanmak kalıcı kısırlığa yol açar.',
      isTrue: false,
      explanation: 'YANLIŞ! Kombine hapların yumurtalık rezervi üzerinde kalıcı bir etkisi yoktur; bırakıldıktan sonra çoğu kadında ovülasyon 1-3 ay içinde geri döner ve bir yıllık gebelik oranları hiç hap kullanmamış kadınlarla aynıdır. Yalnızca üç aylık depo iğnede etkinin geçmesi 6-12 ayı bulabilir. Hap kullanımı sırasında geçen yıllarda yaşın ilerlemesi, hapın kendisiyle karıştırılan gerçek etkendir.',
    },
    {
      id: 'myth-8',
      statement: 'Gebe kalmak için ilişki öncesi uzun süre "sperm biriktirmek" gerekir.',
      isTrue: false,
      explanation: 'YANLIŞ! Uzun cinsel perhiz sperm sayısını bir miktar artırsa da hareketliliği düşürür ve DNA hasarını artırır. Doğurganlık penceresinde her gün veya gün aşırı ilişki, en yüksek gebelik şansını sağlayan düzendir. Günlük birliktelik sperm kalitesini klinik olarak anlamlı biçimde bozmaz.',
    },
    {
      id: 'myth-9',
      statement: 'İnfertilite çoğunlukla kadından kaynaklanır.',
      isTrue: false,
      explanation: 'YANLIŞ! Erkek faktörü olguların yaklaşık %40-50\'sinde tek başına veya kadın faktörüyle birlikte rol oynar; yaklaşık %10-15\'inde ise neden açıklanamaz. Bu nedenle değerlendirme baştan çift olarak yapılmalı ve spermiyogram ilk basamak testler arasında yer almalıdır. Yalnızca kadını araştırmak hem zaman kaybettirir hem de gereksiz girişimlere yol açar.',
    },
    {
      id: 'myth-10',
      statement: 'Bir kez gebe kalabilmiş kişi ikinci kez sorunsuz gebe kalır.',
      isTrue: false,
      explanation: 'YANLIŞ! "Sekonder infertilite" yani daha önce gebe kalmış bir çiftin sonradan gebe kalamaması hiç de nadir değildir. Aradan geçen yıllarda yaş ilerlemesi, kilo değişimi, geçirilmiş enfeksiyon veya cerrahi, endometriozisin ilerlemesi ve sperm parametrelerindeki değişim tabloyu farklılaştırabilir. Bu durumda da yaşa göre 6-12 aylık deneme süresi sonunda başvuru kuralı geçerlidir.',
    },
    {
      id: 'myth-11',
      statement: 'Ovülasyon testi pozitif çıktıysa yumurtlama kesinlikle gerçekleşmiştir.',
      isTrue: false,
      explanation: 'YANLIŞ! Pozitif LH testi yumurtlamanın tetiklendiğini gösterir, tamamlandığını kanıtlamaz. Bazı döngülerde folikül çatlamaz (LUF sendromu). Ayrıca PCOS\'ta bazal LH yüksekliği ve hCG içeren tedaviler yanlış pozitif verebilir. Yumurtlamayı doğrulamak için bazal vücut sıcaklığında kalıcı yükseliş görmek veya döngünün 21. günü civarında progesteron ölçümü yapmak gerekir.',
    },
    {
      id: 'myth-12',
      statement: 'Stresli olduğunuz için gebe kalamıyorsunuz; sadece rahatlayın yeter.',
      isTrue: false,
      explanation: 'YANLIŞ! Bu yaygın söylem bilimsel olarak yanlış olduğu gibi, gebe kalamayan kişilere haksız bir suçluluk yükler. Olağan günlük stres tek başına kısırlık nedeni değildir; tıkalı tüp, düşük sperm sayısı veya yumurtlama bozukluğu gibi durumlar rahatlamayla düzelmez. Yoğun ve uzun süreli stresin ovülasyonu geciktirebildiği doğrudur, bu yüzden stres yönetimi tedavinin destekleyicisidir ama alternatifi değildir.',
    },
    {
      id: 'myth-13',
      statement: 'Doğurganlık penceresini yakalamak için hem servikal mukus hem LH testi takip etmek, tek başına takvim hesabından daha güvenilirdir.',
      isTrue: true,
      explanation: 'DOĞRU! Takvim yöntemi, yumurtlamanın her ay aynı günde olduğunu varsaydığı için özellikle düzensiz döngülerde yanılır. Servikal mukusun yumurta akı kıvamına gelmesi pencerenin açıldığını, LH pozitifliği ise yumurtlamanın 24-36 saat içinde beklendiğini gösterir. İki yöntemi birleştirmek ve bazal vücut sıcaklığıyla doğrulamak, hem zamanlamayı hem de ovülasyonun gerçekleştiğine dair güveni belirgin biçimde artırır.',
    },
  ];

  async getArticles(category?: string, search?: string) {
    let list = [...this.articles];
    if (category && category !== 'all') {
      list = list.filter(a => a.category === category);
    }
    if (search && search.trim() !== '') {
      const q = foldTr(search).trim();
      list = list.filter(
        a =>
          foldTr(a.title).includes(q) ||
          foldTr(a.subtitle).includes(q) ||
          foldTr(a.summary).includes(q) ||
          a.tags.some(t => foldTr(t).includes(q)),
      );
    }
    return {
      items: list,
      total: list.length,
      categories: [
        { id: 'all', name: 'Tümü' },
        { id: 'cycle', name: 'Döngü & Hormonlar' },
        { id: 'conception', name: 'Gebe Kalma & Doğurganlık' },
        { id: 'fertility', name: 'Beden & Cinsellik' },
        { id: 'pregnancy', name: 'Hamilelik & Doğum' },
        { id: 'mood', name: 'Ruh Hali & Zihin' },
        { id: 'fitness', name: 'Beslenme & Egzersiz' },
      ],
    };
  }

  async getArticleById(id: string) {
    const article = this.articles.find(a => a.id === id);
    if (!article) throw new NotFoundException('Makale bulunamadı');
    return article;
  }

  async getFaqs(category?: string, search?: string) {
    let list = [...this.faqs];
    if (category && category !== 'all') {
      list = list.filter(f => f.category === category);
    }
    if (search && search.trim()) {
      const q = foldTr(search).trim();
      list = list.filter(f => foldTr(f.question).includes(q) || foldTr(f.answer).includes(q));
    }
    return {
      items: list,
      total: list.length,
      categories: [
        { id: 'all', name: 'Tümü' },
        { id: 'pregnancy', name: 'Hamilelik & Doğum' },
        { id: 'fertility', name: 'Gebe Kalma & Ovülasyon' },
        { id: 'cycle', name: 'Döngü & Regl' },
        { id: 'wellness', name: 'Beslenme & Vitaminler' },
      ],
    };
  }

  async getMyths() {
    return { items: this.myths, total: this.myths.length };
  }

  async adminUpdateArticle(id: string, data: Partial<ArticleItem>) {
    const idx = this.articles.findIndex(a => a.id === id);
    if (idx === -1) throw new NotFoundException('Makale bulunamadı');
    this.articles[idx] = { ...this.articles[idx], ...data };
    return this.articles[idx];
  }

  async adminUpdateFaq(id: string, data: Partial<(typeof this.faqs)[0]>) {
    const idx = this.faqs.findIndex(f => f.id === id);
    if (idx === -1) throw new NotFoundException('SSS bulunamadı');
    this.faqs[idx] = { ...this.faqs[idx], ...data };
    return this.faqs[idx];
  }

  async adminUpdateMyth(id: string, data: Partial<(typeof this.myths)[0]>) {
    const idx = this.myths.findIndex(m => m.id === id);
    if (idx === -1) throw new NotFoundException('Mit bulunamadı');
    this.myths[idx] = { ...this.myths[idx], ...data };
    return this.myths[idx];
  }
}
