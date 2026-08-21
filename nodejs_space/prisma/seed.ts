import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed test admin account (internal)
  const hashedPasswordInternal = await bcrypt.hash('ju8#6WOSeG', 10);
  await prisma.user.upsert({
    where: { email: 'abacus-707eb50e@example.com' },
    update: {},
    create: {
      email: 'abacus-707eb50e@example.com',
      password: hashedPasswordInternal,
      name: 'System Admin',
      isAdmin: true,
      hasCompletedSetup: true,
      settings: {
        create: {
          activeModules: ['pregnancy', 'period', 'relationship'],
        },
      },
    },
  });

  // Seed demo admin account (admin / 1234566)
  const hashedPasswordAdmin = await bcrypt.hash('1234566', 10);
  await prisma.user.upsert({
    where: { email: 'admin@bloom.com' },
    update: { password: hashedPasswordAdmin, isAdmin: true, nickname: 'admin', name: 'Admin' },
    create: {
      email: 'admin@bloom.com',
      password: hashedPasswordAdmin,
      name: 'Admin',
      nickname: 'admin',
      isAdmin: true,
      hasCompletedSetup: true,
      settings: {
        create: {
          activeModules: ['pregnancy', 'period', 'relationship'],
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'a@a.com' },
    update: { password: hashedPasswordAdmin, isAdmin: true, nickname: 'admin' },
    create: {
      email: 'a@a.com',
      password: hashedPasswordAdmin,
      name: 'Admin',
      nickname: 'admin',
      isAdmin: true,
      hasCompletedSetup: true,
      settings: {
        create: {
          activeModules: ['pregnancy', 'period', 'relationship'],
        },
      },
    },
  });

  // Seed symptom types
  const symptomTypes = [
    { category: 'Ağrı', name: 'Baş ağrısı', displayOrder: 1 },
    { category: 'Ağrı', name: 'Karın ağrısı', displayOrder: 2 },
    { category: 'Ağrı', name: 'Bel ağrısı', displayOrder: 3 },
    { category: 'Ağrı', name: 'Göğüs hassasiyeti', displayOrder: 4 },
    { category: 'Ruh Hali', name: 'Sinirlilik', displayOrder: 5 },
    { category: 'Ruh Hali', name: 'Üzgünlük', displayOrder: 6 },
    { category: 'Ruh Hali', name: 'Kaygı', displayOrder: 7 },
    { category: 'Ruh Hali', name: 'Mutluluk', displayOrder: 8 },
    { category: 'Fiziksel', name: 'Şişkinlik', displayOrder: 9 },
    { category: 'Fiziksel', name: 'Yorgunluk', displayOrder: 10 },
    { category: 'Fiziksel', name: 'Mide bulantısı', displayOrder: 11 },
    { category: 'Fiziksel', name: 'Akne', displayOrder: 12 },
    { category: 'Diğer', name: 'Uykusuzluk', displayOrder: 13 },
    { category: 'Diğer', name: 'İştah değişimi', displayOrder: 14 },
    { category: 'Diğer', name: 'Baş dönmesi', displayOrder: 15 },
  ];

  for (const st of symptomTypes) {
    await prisma.symptomType.upsert({
      where: { name: st.name },
      update: {},
      create: st,
    });
  }

  // Seed pregnancy week content (Turkish) - weeks 1-40
  const weeks = [
    { weekNumber: 1, title: '1. Hafta - Yolculuk Başlıyor', babySize: 'Haşhaş tohumu', babyWeight: '-', babyDevelopment: 'Teknik olarak henüz gebelik başlamamıştır. Vücudunuz yeni bir döngüye hazırlanıyor. Son adet tarihiniz gebelik hesaplamasının başlangıç noktasıdır.', organDevelopment: 'Henüz döllenme gerçekleşmedi.', motherChanges: 'Adet kanaması devam ediyor olabilir. Vücut yeni yumurtalık döngüsüne hazırlanıyor.', commonSymptoms: ['Adet kanaması', 'Kramplar'], tips: ['Folik asit almaya başlayın', 'Sağlıklı beslenmeye dikkat edin', 'Sigara ve alkolden uzak durun'], warnings: ['Doktorunuzla görüşerek gebelik öncesi kontrol yaptırın'] },
    { weekNumber: 2, title: '2. Hafta - Yumurtlama Dönemi', babySize: 'Haşhaş tohumu', babyWeight: '-', babyDevelopment: 'Yumurtalıktan yumurta salınıyor. Döllenme bu hafta gerçekleşebilir.', organDevelopment: 'Yumurta hücresi olgunlaşıyor.', motherChanges: 'Yumurtlama belirtileri görülebilir. Servikal mukus değişimleri olabilir.', commonSymptoms: ['Hafif kasık ağrısı', 'Mukus değişimi'], tips: ['Folik asit almaya devam edin', 'Stres yönetimine dikkat edin'], warnings: [] },
    { weekNumber: 3, title: '3. Hafta - Döllenme', babySize: 'Gelincik tohumu', babyWeight: '-', babyDevelopment: 'Sperm ve yumurta birleşerek zigotu oluşturur. Hücre bölünmesi başlar ve blastosist oluşmaya başlar.', organDevelopment: 'Genetik yapı belirlendi: cinsiyet, göz rengi, saç rengi.', motherChanges: 'Henüz belirgin değişiklikler hissedilmeyebilir. İmplantasyon kanaması olabilir.', commonSymptoms: ['Hafif lekelenme', 'Karın gerginliği'], tips: ['Günlük 400mcg folik asit alın', 'Kafein tüketimini azaltın'], warnings: [] },
    { weekNumber: 4, title: '4. Hafta - İmplantasyon', babySize: 'Haşhaş tohumu', babyWeight: '-', babyDevelopment: 'Blastosist rahme yerleşir. Embriyo ve plasenta oluşmaya başlar. Amniyotik kese gelişmeye başlar.', organDevelopment: 'İç hücre kümesi organları oluşturacak yapıya dönüşüyor.', motherChanges: 'İmplantasyon kanaması olabilir. hCG hormonu yükselmeye başlar. Gebelik testi pozitif çıkabilir.', commonSymptoms: ['Göğüs hassasiyeti', 'Yorgunluk', 'Hafif kramplar'], tips: ['Gebelik testi yapın', 'Doktorunuzdan randevu alın'], warnings: ['Kanama veya şiddetli kramp olursa doktorunuza başvurun'] },
    { weekNumber: 5, title: '5. Hafta - Kalp Atışı', babySize: 'Susam tohumu', babyWeight: '-', babyDevelopment: 'Embriyo hızla büyüyor. Sinir tüpü (beyin ve omuriliğin temeli) gelişmeye başlar. Kalp tüpü oluşur ve atmaya başlar.', organDevelopment: 'Sinir sistemi, kalp ve kan damarları gelişiyor.', motherChanges: 'Sabah bulantısı başlayabilir. Sık idrara çıkma olabilir. Göğüslerde büyüme ve hassasiyet.', commonSymptoms: ['Bulantı', 'Yorgunluk', 'Sık idrara çıkma', 'Göğüs hassasiyeti'], tips: ['Küçük ve sık öğünler yiyin', 'Bol su için', 'Dinlenmeye özen gösterin'], warnings: ['Şiddetli bulantı ve kusma varsa doktorunuza danışın'] },
    { weekNumber: 6, title: '6. Hafta - Organlar Şekilleniyor', babySize: 'Mercimek', babyWeight: '-', babyDevelopment: 'Embriyo yaklaşık 4mm uzunluğunda. Yüz hatları belirginleşmeye başlıyor. Kol ve bacak tomurcukları görülüyor.', organDevelopment: 'Kalp dört odacığa ayrılıyor. Akciğerler, karaciğer ve böbrekler oluşmaya başlıyor.', motherChanges: 'Sabah bulantısı artabilir. Duygusal değişimler yoğunlaşabilir. Koku hassasiyeti artabilir.', commonSymptoms: ['Şiddetli bulantı', 'Koku hassasiyeti', 'Duygusal dalgalanmalar', 'Yorgunluk'], tips: ['Zencefil çayı bulantıya iyi gelebilir', 'Tetikleyen kokulardan uzak durun'], warnings: ['Kanama veya şiddetli karın ağrısı durumunda acil doktorunuza başvurun'] },
    { weekNumber: 7, title: '7. Hafta - Hızlı Büyüme', babySize: 'Yaban mersini', babyWeight: '-', babyDevelopment: 'Embriyo yaklaşık 1cm. Beyin hızla gelişiyor. El ve ayak parmakları oluşmaya başlıyor.', organDevelopment: 'Bağırsaklar, pankreas ve apandis gelişiyor. Göz lensleri oluşuyor.', motherChanges: 'Şişkinlik ve gaz artabilir. Tükürük artışı olabilir. Baş ağrıları olabilir.', commonSymptoms: ['Şişkinlik', 'Baş ağrısı', 'Aşerme', 'Yorgunluk'], tips: ['Lifli gıdalar tüketin', 'Günde 8-10 bardak su için'], warnings: [] },
    { weekNumber: 8, title: '8. Hafta - Hareket Başlıyor', babySize: 'Ahududu', babyWeight: '1 gram', babyDevelopment: 'Embriyo yaklaşık 1.5cm. İlk hareketler başlar ama henüz hissedilmez. Parmaklar birbirinden ayrılmaya başlar.', organDevelopment: 'Tüm ana organlar oluşmuş durumda. Kulak yapısı gelişiyor. Üst dudak ve burun şekilleniyor.', motherChanges: 'Rahim büyümeye devam ediyor. Bel ağrısı başlayabilir. Cilt değişimleri olabilir.', commonSymptoms: ['Bel ağrısı', 'Bulantı', 'Göğüs büyümesi', 'Kabızlık'], tips: ['Rahat kıyafetler tercih edin', 'Düzenli hafif egzersiz yapın'], warnings: ['İlk ultrason randevunuzu planlayın'] },
    { weekNumber: 9, title: '9. Hafta - Fetüs Dönemi', babySize: 'Zeytin', babyWeight: '2 gram', babyDevelopment: 'Artık embriyo değil fetüs olarak adlandırılır. Yaklaşık 2.5cm. Yüz hatları belirginleşiyor. Kuyruk kaybolmuştur.', organDevelopment: 'Kalp dört odacıklı yapısını tamamlıyor. Kaslar gelişiyor. Üreme organları oluşmaya başlıyor.', motherChanges: 'Bel kalınlaşmaya başlayabilir. Duygusal dalgalanmalar devam eder. Ciltte değişimler olabilir.', commonSymptoms: ['Duygusal dalgalanmalar', 'Yorgunluk', 'Sık idrara çıkma'], tips: ['Prenatal vitamin almaya devam edin', 'Yeterli uyku alın'], warnings: [] },
    { weekNumber: 10, title: '10. Hafta - Parmak İzleri', babySize: 'Çilek', babyWeight: '4 gram', babyDevelopment: 'Yaklaşık 3cm. Parmak izleri oluşmaya başlar. Tırnaklar gelişiyor. Diş tomurcukları oluşuyor.', organDevelopment: 'Böbrekler idrar üretmeye başlıyor. Mide sindirim sıvıları üretiyor. Karaciğer kırmızı kan hücreleri üretiyor.', motherChanges: 'Karın hafif şişkinlik gösterebilir. Damarlar daha belirgin olabilir. Saç ve tırnaklar daha hızlı uzayabilir.', commonSymptoms: ['Şişkinlik', 'Baş ağrısı', 'Yorgunluk', 'Mide ekşimesi'], tips: ['Demir açısından zengin gıdalar tüketin', 'Düzenli doktor kontrollerine gidin'], warnings: [] },
    { weekNumber: 11, title: '11. Hafta - Aktif Bebekçik', babySize: 'İncir', babyWeight: '7 gram', babyDevelopment: 'Yaklaşık 4cm. Bebek tekmelemeye, esnemeye ve hıçkırık yapmaya başlar. Baş gövdenin yarısı büyüklüğündedir.', organDevelopment: 'Dış kulaklar son şeklini alıyor. Diyafram gelişiyor. Saç folikülleri oluşuyor.', motherChanges: 'Bulantı azalmaya başlayabilir. Enerji seviyesi artabilir. Karın hafifçe belirginleşiyor.', commonSymptoms: ['Azalan bulantı', 'Baş dönmesi', 'Kabızlık'], tips: ['Hafif yürüyüşler yapın', 'Kalsiyum alımına dikkat edin'], warnings: [] },
    { weekNumber: 12, title: '12. Hafta - İlk Trimester Sonu', babySize: 'Limon', babyWeight: '14 gram', babyDevelopment: 'Yaklaşık 5cm. Refleksler gelişiyor. Bebek parmağını emmeye başlayabilir. Yüz ifadeleri oluşmaya başlar.', organDevelopment: 'Kemik iliği kan hücreleri üretmeye başlıyor. Bağırsaklar karın boşluğuna yerleşiyor. Hipofiz bezi hormon üretiyor.', motherChanges: 'Düşük riski önemli ölçüde azalır. Rahim kasık kemiklerinin üzerine yükselir. Cilt pigmentasyonu değişebilir.', commonSymptoms: ['Baş dönmesi', 'Karın gerginliği', 'Cilt değişimleri'], tips: ['İkinci trimester tarama testlerini planlayın', 'Gebelik haberi paylaşımını değerlendirin'], warnings: ['NT taraması için son hafta olabilir'] },
    { weekNumber: 13, title: '13. Hafta - İkinci Trimester', babySize: 'Şeftali', babyWeight: '23 gram', babyDevelopment: 'Yaklaşık 7cm. Parmak izleri benzersiz desenlerle şekilleniyor. Ses telleri gelişiyor.', organDevelopment: 'Pankreas insülin üretmeye başlıyor. Dalak kırmızı kan hücreleri üretiyor.', motherChanges: 'Enerji artışı hissedilir. Bulantı genellikle azalır. Karın belirginleşmeye başlar.', commonSymptoms: ['Artan enerji', 'Azalan bulantı', 'Kabızlık'], tips: ['Egzersiz rutini oluşturun', 'Dengeli beslenmeye devam edin'], warnings: [] },
    { weekNumber: 14, title: '14. Hafta - Yüz İfadeleri', babySize: 'Nektarin', babyWeight: '43 gram', babyDevelopment: 'Yaklaşık 9cm. Bebek yüz ifadeleri yapabiliyor: kaş çatma, yüz buruşturma. Lanugo (ince tüyler) vücudu kaplamaya başlar.', organDevelopment: 'Tiroit bezi hormon üretiyor. Erkek bebeklerde prostat, kız bebeklerde yumurtalıklar gelişiyor.', motherChanges: 'İkinci trimester enerjisi hissedilir. Saçlar daha dolgun görünebilir.', commonSymptoms: ['Burun tıkanıklığı', 'Diş eti hassasiyeti', 'İştah artışı'], tips: ['Diş sağlığı kontrolü yaptırın', 'Omega-3 açısından zengin gıdalar tüketin'], warnings: [] },
    { weekNumber: 15, title: '15. Hafta - Duyular Gelişiyor', babySize: 'Elma', babyWeight: '70 gram', babyDevelopment: 'Yaklaşık 10cm. Bebek ışığa duyarlı hale geliyor. Tat alma tomurcukları oluşuyor. Hıçkırık yapabilir.', organDevelopment: 'İskelet sistemi sertleşmeye devam ediyor. Kulak kemikleri gelişiyor.', motherChanges: 'Karın belirgin şekilde büyüyor. Burun kanaması olabilir. Vücutta sıvı retansiyonu artabilir.', commonSymptoms: ['Burun kanaması', 'Şişlik', 'Sırt ağrısı'], tips: ['Sol tarafınıza yatarak uyumayı deneyin', 'Bol su için'], warnings: [] },
    { weekNumber: 16, title: '16. Hafta - İlk Hareketler', babySize: 'Avokado', babyWeight: '100 gram', babyDevelopment: 'Yaklaşık 12cm. Bazı anneler ilk bebek hareketlerini (quickening) hissedebilir. Yüz kasları gelişiyor.', organDevelopment: 'Sinir sistemi hızla olgunlaşıyor. Göz kasları çalışmaya başlıyor.', motherChanges: 'İlk bebek hareketleri hissedilebilir. Sırt ağrısı artabilir. Kilo artışı belirginleşir.', commonSymptoms: ['Sırt ağrısı', 'Kabızlık', 'Nefes darlığı'], tips: ['Hamilelik yastığı kullanın', 'Kegel egzersizleri yapın'], warnings: ['16-20 hafta arası üçlü veya dörtlü tarama testi yapılabilir'] },
    { weekNumber: 17, title: '17. Hafta - Yağ Depolama', babySize: 'Nar', babyWeight: '140 gram', babyDevelopment: 'Yaklaşık 13cm. Bebek yağ depolamaya başlıyor. Ter bezleri gelişiyor. Göbek bağı güçleniyor.', organDevelopment: 'Beyin hızla büyüyor. Miyelin kılıfı sinir hücrelerini kaplamaya başlıyor.', motherChanges: 'Denge merkezi değişebilir. Cilt kuruluğu veya kaşıntı olabilir. Rüyalar canlılaşabilir.', commonSymptoms: ['Cilt kuruluğu', 'Bacak krampları', 'Canlı rüyalar'], tips: ['Cilt nemlendiricisi kullanın', 'Magnezyum açısından zengin gıdalar tüketin'], warnings: [] },
    { weekNumber: 18, title: '18. Hafta - Duyma Başlıyor', babySize: 'Tatlı patates', babyWeight: '190 gram', babyDevelopment: 'Yaklaşık 14cm. Bebek sesleri duymaya başlar. Esneme ve yutkunma hareketleri belirginleşir.', organDevelopment: 'İç kulak kemikleri sertleşiyor. Sindirim sistemi çalışmaya başlıyor. Miyelin oluşumu hızlanıyor.', motherChanges: 'Bebek hareketleri daha belirgin hissedilir. Kan basıncı düşebilir. Baş dönmesi olabilir.', commonSymptoms: ['Baş dönmesi', 'Bacak krampları', 'Bel ağrısı', 'Mide ekşimesi'], tips: ['Bebeğinizle konuşun ve müzik dinletin', 'Yavaş kalkın, ani hareketlerden kaçının'], warnings: ['Detaylı ultrason (anomali taraması) planlanmalı'] },
    { weekNumber: 19, title: '19. Hafta - Verniks Tabakası', babySize: 'Mango', babyWeight: '240 gram', babyDevelopment: 'Yaklaşık 15cm. Verniks caseosa (koruyucu beyaz tabaka) cildi kaplamaya başlar. Uyku-uyanıklık döngüsü oluşuyor.', organDevelopment: 'Beyin duyusal alanlar geliştiriyor. Böbrekler tam kapasiteyle çalışıyor.', motherChanges: 'Kalça ve kasık ağrıları olabilir. Göbek deliği düzleşmeye veya çıkmaya başlayabilir.', commonSymptoms: ['Kalça ağrısı', 'Baş dönmesi', 'Bacak krampları'], tips: ['Rahat ayakkabılar giyin', 'Hamilelik egzersizlerine devam edin'], warnings: [] },
    { weekNumber: 20, title: '20. Hafta - Yarı Yol!', babySize: 'Muz', babyWeight: '300 gram', babyDevelopment: 'Yaklaşık 25cm (baş-topuk). Gebeliğin yarısı tamamlandı! Bebek aktif olarak hareket ediyor. Cinsiyet ultrasonla belirlenebilir.', organDevelopment: 'Sinir hücreleri hızla çoğalıyor. Sindirim sistemi mekonyum üretmeye başlıyor.', motherChanges: 'Rahmin üst kısmı göbek hizasına ulaşır. Nefes darlığı artabilir. Cilt çatlamaları başlayabilir.', commonSymptoms: ['Nefes darlığı', 'Çatlak oluşumu', 'Sırt ağrısı', 'Şişlik'], tips: ['Çatlak kremi kullanmaya başlayın', 'Detaylı ultrason yaptırın'], warnings: ['20. hafta anomali taraması çok önemlidir'] },
    { weekNumber: 21, title: '21. Hafta - Tat Alma', babySize: 'Havuç', babyWeight: '360 gram', babyDevelopment: 'Yaklaşık 27cm. Bebek amniyotik sıvıyı yutarak tat almaya başlar. Hareketler düzenli hale gelir.', organDevelopment: 'Bağırsaklar besinleri emmeye başlıyor. Kemik iliği kan üretiyor.', motherChanges: 'Braxton Hicks kasılmaları başlayabilir. Varisler oluşabilir. İştah artışı belirginleşir.', commonSymptoms: ['Braxton Hicks', 'Varisler', 'İştah artışı'], tips: ['Günlük protein alımını artırın', 'Bacaklarınızı yukarı kaldırarak dinlenin'], warnings: [] },
    { weekNumber: 22, title: '22. Hafta - Göz Gelişimi', babySize: 'Papaya', babyWeight: '430 gram', babyDevelopment: 'Yaklaşık 28cm. Gözler oluşmuş ama iris henüz renksiz. Dudaklar ve kaşlar belirginleşiyor. Kavrama refleksi güçleniyor.', organDevelopment: 'Akciğerler surfaktan üretmeye başlıyor. Pankreas olgunlaşıyor. Labirent (iç kulak) tam gelişiyor.', motherChanges: 'Karın belirgin şekilde büyümüş. Sırt ağrıları artabilir. Cilt değişimleri (çatlaklar, koyulaşma) olabilir.', commonSymptoms: ['Sırt ağrısı', 'Çatlaklar', 'Hemoroid'], tips: ['Doğum hazırlık kurslarını araştırın', 'Lifli beslenin, bol su için'], warnings: [] },
    { weekNumber: 23, title: '23. Hafta - Hızlı Kilo', babySize: 'Greyfurt', babyWeight: '500 gram', babyDevelopment: 'Yaklaşık 29cm. Bebek hızla kilo alıyor. Cilt kırışık ama dolgunlaşmaya başlıyor. Akciğerler gelişmeye devam ediyor.', organDevelopment: 'Akciğer damarları gelişiyor. Beyin dalga aktivitesi hızlanıyor.', motherChanges: 'Ayak şişmesi artabilir. Uyku kalitesi düşebilir. Karın kaşıntısı olabilir.', commonSymptoms: ['Ayak şişmesi', 'Uyku bozukluğu', 'Karın kaşıntısı'], tips: ['Ayaklarınızı yüksekte tutun', 'Destekli uyku pozisyonları deneyin'], warnings: [] },
    { weekNumber: 24, title: '24. Hafta - Yaşama Şansı', babySize: 'Mısır koçanı', babyWeight: '600 gram', babyDevelopment: 'Yaklaşık 30cm. Bu haftadan itibaren erken doğum durumunda yaşama şansı önemli ölçüde artar. Yüz tamamen şekillenmiş.', organDevelopment: 'Akciğerler dallanmaya devam ediyor. İç kulak denge sistemi olgunlaşıyor.', motherChanges: 'Şeker yükleme testi zamanı. Sırt ağrıları yoğunlaşabilir. Uyku düzeni bozulabilir.', commonSymptoms: ['Sırt ağrısı', 'Bacak krampları', 'Uyku bozukluğu', 'Karpal tünel sendromu'], tips: ['Şeker yükleme testini yaptırın', 'Hamilelik yastığı kullanın'], warnings: ['24-28 hafta arası gestasyonel diyabet taraması yapılmalı'] },
    { weekNumber: 25, title: '25. Hafta - Aktif Bebeğim', babySize: 'Karnıbahar', babyWeight: '660 gram', babyDevelopment: 'Yaklaşık 35cm. Bebek çok aktif: tekmeliyor, yuvarlanıyor, uzanıyor. Nostril açılıyor, nefes pratikleri başlıyor.', organDevelopment: 'Sinir sistemi olgunlaşıyor. Kan damarları akciğerlerde gelişiyor.', motherChanges: 'Mide ekşimesi artabilir. Hemoroid şikayetleri olabilir. Cilt kaşıntısı devam edebilir.', commonSymptoms: ['Mide ekşimesi', 'Hemoroid', 'Nefes darlığı'], tips: ['Küçük porsiyon yiyin', 'Baharatlı yiyeceklerden kaçının'], warnings: [] },
    { weekNumber: 26, title: '26. Hafta - Göz Açılıyor', babySize: 'Kabak', babyWeight: '760 gram', babyDevelopment: 'Yaklaşık 36cm. Bebek gözlerini açmaya başlar. Işığa ve sese tepki verir. Nefes hareketleri düzenli hale gelir.', organDevelopment: 'Görme duyusu gelişiyor. Bağışıklık sistemi güçleniyor. Akciğerler surfaktan üretmeye devam ediyor.', motherChanges: 'Braxton Hicks kasılmaları sıklaşabilir. Uyku kalitesi daha da düşebilir. Sırt ve kalça ağrıları artabilir.', commonSymptoms: ['Braxton Hicks', 'Uyku bozukluğu', 'Sırt ağrısı'], tips: ['Doğum planınızı düşünmeye başlayın', 'Bebek odası hazırlıklarına başlayın'], warnings: [] },
    { weekNumber: 27, title: '27. Hafta - İkinci Trimester Sonu', babySize: 'Brokoli', babyWeight: '875 gram', babyDevelopment: 'Yaklaşık 37cm. İkinci trimester sona eriyor. Bebek düzenli uyku döngüsüne giriyor. Beyin çok aktif.', organDevelopment: 'Beyin hızla büyüyor ve kıvrımlar oluşuyor. Ağ tabakası (retina) gelişiyor.', motherChanges: 'Kilo artışı belirginleşir. Nefes darlığı artabilir. Karın gerginliği olabilir.', commonSymptoms: ['Nefes darlığı', 'Bacak krampları', 'Sırt ağrısı', 'Uyku bozukluğu'], tips: ['Üçüncü trimestere hazırlanın', 'Doğum çantası listesi yapın'], warnings: [] },
    { weekNumber: 28, title: '28. Hafta - Üçüncü Trimester', babySize: 'Patlıcan', babyWeight: '1 kg', babyDevelopment: 'Yaklaşık 38cm ve 1kg. Üçüncü trimester başlıyor! Bebek rüya görebilir. Göz kırpma refleksi gelişiyor.', organDevelopment: 'Beyin milyarlarca nöron üretiyor. Kemikler sertleşmeye devam ediyor. Akciğerler olgunlaşıyor.', motherChanges: 'Doktor ziyaretleri sıklaşır (2 haftada bir). Nefes darlığı belirginleşir. Yorgunluk artar.', commonSymptoms: ['Yorgunluk', 'Nefes darlığı', 'Sık idrara çıkma', 'Mide ekşimesi'], tips: ['Anti-D antikoru gerekebilir (Rh negatif iseler)', 'Bebek hareketlerini takip edin'], warnings: ['Bebek hareketlerinde azalma olursa hemen doktorunuza başvurun'] },
    { weekNumber: 29, title: '29. Hafta - Kemikler Güçleniyor', babySize: 'Balkabağı (küçük)', babyWeight: '1.15 kg', babyDevelopment: 'Yaklaşık 39cm. Kemikler kalsiyum depolayarak sertleşiyor. Kas ve akciğer gelişimi hızlanıyor. Bebek daha az yer bularak hareketleri değişiyor.', organDevelopment: 'Böbrekler günde yarım litre idrar üretiyor. Beyin yüzey alanı artıyor.', motherChanges: 'Sık idrara çıkma artar. Uyumak zorlaşabilir. Varisler belirginleşebilir.', commonSymptoms: ['Sık idrara çıkma', 'Varisler', 'Bel ağrısı', 'Halsizlik'], tips: ['Kalsiyum ve demir alımını artırın', 'Hamilelik egzersizlerine devam edin'], warnings: [] },
    { weekNumber: 30, title: '30. Hafta - Beyin Gelişimi', babySize: 'Lahana', babyWeight: '1.3 kg', babyDevelopment: 'Yaklaşık 40cm. Beyin hızla gelişiyor ve kıvrımlar derinleşiyor. Lanugo tüyleri dökülmeye başlıyor. Kemik iliği kırmızı kan hücresi üretiyor.', organDevelopment: 'Beyin sinir bağlantıları güçleniyor. Sindirim sistemi olgunlaşıyor.', motherChanges: 'Nefes almak zorlaşabilir. Uyku bozuklukları devam eder. Kasılmalar artabilir.', commonSymptoms: ['Nefes darlığı', 'Uyku bozukluğu', 'Ödem', 'Kasılmalar'], tips: ['Sol tarafınıza yatarak uyuyun', 'Doğum hazırlık kursuna başlayın'], warnings: [] },
    { weekNumber: 31, title: '31. Hafta - Beş Duyu', babySize: 'Hindistan cevizi', babyWeight: '1.5 kg', babyDevelopment: 'Yaklaşık 41cm. Beş duyu aktif: bebek görebilir, duyabilir, dokunabilir, tadabilir ve koklayabilir. Kilo artışı hızlanıyor.', organDevelopment: 'Akciğerler ve sindirim sistemi olgunlaşmaya devam ediyor. Bağışıklık sistemi güçleniyor.', motherChanges: 'Braxton Hicks sıklaşabilir. Nefes darlığı devam eder. Sık tuvalete gitme artar.', commonSymptoms: ['Braxton Hicks', 'Nefes darlığı', 'Sık idrara çıkma', 'Yorgunluk'], tips: ['Doğum çantanızı hazırlamaya başlayın', 'Bebek hareketlerini günlük sayın'], warnings: ['Günde en az 10 hareket hissetmelisiniz'] },
    { weekNumber: 32, title: '32. Hafta - Baş Aşağı', babySize: 'Kavun', babyWeight: '1.7 kg', babyDevelopment: 'Yaklaşık 42cm. Çoğu bebek baş aşağı pozisyona geçer. Tırnaklar parmak uçlarına ulaşır. Cilt pürüzsüzleşiyor.', organDevelopment: 'Akciğerler neredeyse tam olgunlaşmış. İskelet sistemi sertleşmeye devam ediyor (kafatası hariç).', motherChanges: 'Rahimin üst kısmı kaburgalara yaklaşır. Mide ekşimesi şiddetlenebilir. Ayak ve bacak şişmesi artabilir.', commonSymptoms: ['Mide ekşimesi', 'Ayak şişmesi', 'Nefes darlığı', 'Uyku bozukluğu'], tips: ['Hazırlıklarınızı tamamlayın', 'Sık sık küçük porsiyonlar yiyin'], warnings: ['Bebek henüz baş aşağı dönmediyse endişelenmeyin, hâlâ zaman var'] },
    { weekNumber: 33, title: '33. Hafta - Bağışıklık Transferi', babySize: 'Ananas', babyWeight: '1.9 kg', babyDevelopment: 'Yaklaşık 44cm. Anne bağışıklık antikorlarını bebeğe aktarıyor. Bebek gün içinde uyku ve uyanıklık döngüsü izliyor.', organDevelopment: 'Akciğerler surfaktan üretmeye devam ediyor. Beyin hızla büyüyor.', motherChanges: 'Pelvik basınç artabilir. Uykusuzluk yaygınlaşır. Yorgunluk artar.', commonSymptoms: ['Pelvik basınç', 'Uykusuzluk', 'Yorgunluk', 'Sırt ağrısı'], tips: ['Dinlenmeye öncelik verin', 'Doğum planınızı tamamlayın'], warnings: [] },
    { weekNumber: 34, title: '34. Hafta - Akciğerler Olgunlaşıyor', babySize: 'Kavun (büyük)', babyWeight: '2.1 kg', babyDevelopment: 'Yaklaşık 45cm. Akciğerler büyük ölçüde olgunlaşmıştır. Verniks kalınlaşır. Merkezi sinir sistemi olgunlaşıyor.', organDevelopment: 'Akciğerler neredeyse tam fonksiyonel. Böbrekler tam kapasite çalışıyor.', motherChanges: 'Görme bulanıklığı olabilir. Karpal tünel sendromu şiddetlenebilir. Kasılmalar sıklaşabilir.', commonSymptoms: ['Görme bulanıklığı', 'Karpal tünel', 'Kasılmalar', 'Yorgunluk'], tips: ['Hastane çantanızı hazırlayın', 'Acil numaraları el altında bulundurun'], warnings: ['Görme bozukluğu ve şiddetli baş ağrısı preeklampsi belirtisi olabilir'] },
    { weekNumber: 35, title: '35. Hafta - Böbrekler Tam Kapasitede', babySize: 'Bal kabağı', babyWeight: '2.4 kg', babyDevelopment: 'Yaklaşık 46cm. Böbrekler tamamen gelişmiştir. Karaciğer bazı atıkları işleyebilir. Bebek alanı daraldıkça hareketler değişir.', organDevelopment: 'Tüm organlar olgunlaşmaya devam ediyor. Yağ depolanması artıyor.', motherChanges: 'Sık idrara çıkma çok artar. Nefes almak zorlaşır. Pelvik basınç belirginleşir.', commonSymptoms: ['Sık idrara çıkma', 'Pelvik basınç', 'Nefes darlığı', 'Ödem'], tips: ['Grup B Streptokok testi yaptırın', 'Doğum belirtilerini öğrenin'], warnings: ['35-37 hafta arası GBS testi önerilir'] },
    { weekNumber: 36, title: '36. Hafta - Doğuma Hazırlık', babySize: 'Karpuz (küçük)', babyWeight: '2.6 kg', babyDevelopment: 'Yaklaşık 47cm. Bebek doğum kanalına doğru inmeye başlar. Yağ depolanması devam eder. Cilt pürüzsüzleşir.', organDevelopment: 'Sindirim sistemi hazır. Bağışıklık sistemi güçlenmeye devam ediyor.', motherChanges: 'Bebek aşağı indiğinde nefes almak kolaylaşır ama mesane basıncı artar. Pelvik ağrılar artabilir.', commonSymptoms: ['Pelvik ağrı', 'Sık idrara çıkma', 'Yorgunluk', 'Uyku bozukluğu'], tips: ['Haftalık doktor kontrollerine başlayın', 'Doğum çantanızı kapıda hazır tutun'], warnings: ['Bu haftadan sonra doğum "erken term" sayılır'] },
    { weekNumber: 37, title: '37. Hafta - Erken Term', babySize: 'Karpuz', babyWeight: '2.9 kg', babyDevelopment: 'Yaklaşık 48cm. Bebek artık "erken term" kabul edilir. Kavrama güçlüdür. Akciğerler yeterli surfaktan üretiyor.', organDevelopment: 'Tüm organlar fonksiyonel. Beyin ve akciğerler son olgunlaşma aşamasında.', motherChanges: 'Servikal değişiklikler başlayabilir. Mukus tıkacı gelebilir. Kasılmalar düzensiz olabilir.', commonSymptoms: ['Düzensiz kasılmalar', 'Pelvik basınç', 'Vajinal akıntı artışı', 'Halsizlik'], tips: ['Doğum belirtilerini iyi bilin', 'Su gelirse veya düzenli kasılmalar başlarsa hastaneye gidin'], warnings: ['Su gelmesi, düzenli kasılmalar veya kanama olursa hemen hastaneye gidin'] },
    { weekNumber: 38, title: '38. Hafta - Tam Zamanında', babySize: 'Karpuz', babyWeight: '3.1 kg', babyDevelopment: 'Yaklaşık 50cm. Bebek doğuma hazır. Organlar tam olgun. Mekonyum bağırsaklarda birikmiştir.', organDevelopment: 'Tüm organlar tam fonksiyonel. Beyin sinir bağlantıları güçlenmeye devam ediyor.', motherChanges: 'İç huzursuzluk ve "yuvalama içgüdüsü" hissedebilirsiniz. Servikal açılma başlayabilir.', commonSymptoms: ['Yuvalama içgüdüsü', 'Kasılmalar', 'Pelvik basınç', 'Uykusuzluk'], tips: ['Dinlenin ve enerjinizi koruyun', 'Hastane yolunu planlayın'], warnings: ['Düzenli ve sıklaşan kasılmalar doğumun başladığının işaretidir'] },
    { weekNumber: 39, title: '39. Hafta - Doğum Yaklaşıyor', babySize: 'Karpuz', babyWeight: '3.3 kg', babyDevelopment: 'Yaklaşık 51cm. Bebek tam vadede. Beyin gelişimi doğumdan sonra da devam edecek. Göğüs çıkıntısı olabilir (anne hormonlarından).', organDevelopment: 'Tüm sistemler tam çalışıyor. Bağırsak mekonyumla dolu.', motherChanges: 'Serviks incelir ve açılır. Mukus tıkacı gelebilir. Düzenli kasılmalar başlayabilir.', commonSymptoms: ['Kasılmalar', 'Bel ağrısı', 'Vajinal akıntı', 'Huzursuzluk'], tips: ['Sakin kalın ve nefes egzersizleri yapın', 'Hastane çantanız hazır olsun'], warnings: ['Su gelirse, kanlı akıntı olursa veya kasılmalar 5 dakikada bir geliyorsa hastaneye gidin'] },
    { weekNumber: 40, title: '40. Hafta - Tahmini Doğum Tarihi', babySize: 'Karpuz', babyWeight: '3.4 kg', babyDevelopment: 'Yaklaşık 51cm. Bebek doğuma tamamen hazır! Sadece %5 bebek tam tahmini doğum tarihinde doğar. Biraz daha beklemek gerekebilir.', organDevelopment: 'Tüm organlar tam olgun ve fonksiyonel.', motherChanges: 'Serviks açılmaya devam eder. Kasılmalar düzenli hale gelebilir. "Nesting" içgüdüsü güçlü olabilir.', commonSymptoms: ['Kasılmalar', 'Pelvik basınç', 'Huzursuzluk', 'Yorgunluk'], tips: ['Sabırlı olun, her bebek kendi zamanında gelir', 'Doktorunuzla düzenli iletişimde kalın'], warnings: ['41. haftayı geçerseniz doktorunuz doğumu başlatmayı (indüksiyon) önerebilir'] }
  ];

  for (const week of weeks) {
    await prisma.pregnancyWeekContent.upsert({
      where: { weekNumber: week.weekNumber },
      update: { title: week.title, babySize: week.babySize, babyWeight: week.babyWeight },
      create: week,
    });
  }

  // Topluluk örnek verileri (gerçekçi gönderi ve yorumlar)
  const demoPassword = await bcrypt.hash('demo1234', 10);
  const demoUsers = [
    { email: 'elif.k@demo.local', name: 'Elif K.', nickname: 'elif_k' },
    { email: 'zeynep.a@demo.local', name: 'Zeynep A.', nickname: 'zeynep_a' },
    { email: 'merve.d@demo.local', name: 'Merve D.', nickname: 'merve_d' },
    { email: 'selin.y@demo.local', name: 'Selin Y.', nickname: 'selin_y' },
    { email: 'ayse.t@demo.local', name: 'Ayşe T.', nickname: 'ayse_t' },
  ];

  const userIds: string[] = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        password: demoPassword,
        name: u.name,
        nickname: u.nickname,
        hasCompletedSetup: true,
        settings: { create: { activeModules: ['period'] } },
      },
    });
    userIds.push(user.id);
  }

  const existingPosts = await prisma.communityPost.count();
  if (existingPosts < 5) {
    const postsData = [
      {
        authorIdx: 0,
        content: '28 günlük döngüm son 3 aydır 32-33 güne çıktı. Stres mi yoksa normal mi? Sizde de oluyor mu?',
        category: 'cycle',
        comments: [
          { authorIdx: 1, content: 'Bende de stres dönemlerinde gecikme oluyor, genelde 2-3 gün sonra geliyor regl.' },
          { authorIdx: 2, content: 'Ben de benzer yaşadım, doktorum 21-35 gün aralığının normal olduğunu söyledi.' },
        ],
      },
      {
        authorIdx: 1,
        content: '22. haftadayım ve bebek hareketlerini akşamları daha net hissediyorum. Siz hangi saatlerde daha çok hissediyorsunuz?',
        category: 'pregnancy',
        pregnancyWeek: 22,
        comments: [
          { authorIdx: 3, content: 'Ben de akşam yemekten sonra daha aktif oluyordu, muhtemelen şeker yükselince hareketleniyor 😊' },
          { authorIdx: 4, content: 'Yan yatınca daha iyi hissediyorum, doktorum da öyle demişti.' },
        ],
      },
      {
        authorIdx: 2,
        content: 'TTC 6. ayımız. Ovülasyon günlerini takip ediyoruz ama henüz olmadı. Moral bozulmaya başladım açıkçası.',
        category: 'fertility',
        comments: [
          { authorIdx: 0, content: 'Çok normal hissediyorsun, ben 8. ayda oldu. Kendine nazik ol 💕' },
          { authorIdx: 1, content: 'BBT ve akıntı takibini birlikte yapmayı dene, bana çok yardımcı olmuştu.' },
        ],
      },
      {
        authorIdx: 3,
        content: 'Partnerimle Pusena Partner Modu\'nu eşleştirdik, regl dönemimde bana çay getirmesi için bildirim gidiyor ona 😂 Çok tatlı oldu.',
        category: 'relationship',
        comments: [
          { authorIdx: 4, content: 'Biz de kullanıyoruz! Özellikle PMS döneminde küçük hatırlatmalar ilişkiye iyi geliyor.' },
        ],
      },
      {
        authorIdx: 4,
        content: 'Luteal evrede çok yorgun düşüyorum, normal mi? Foliküler evrede adeta süper kahraman gibiyim ama reglden 1 hafta önce bitkin oluyorum.',
        category: 'cycle',
        comments: [
          { authorIdx: 0, content: 'Progesteron artınca enerji düşüyor, bende de aynı. Magnezyum takviyesi biraz rahatlattı.' },
          { authorIdx: 2, content: 'Demir düşük mü diye baktırdın mı? Regl öncesi yorgunluk bazen ondan da oluyor.' },
          { authorIdx: 1, content: 'Kesinlikle normal! Döngü takibi sayesinde artık o günleri planlıyorum, zorlamıyorum kendimi.' },
        ],
      },
      {
        authorIdx: 0,
        content: 'İlk gebeliğim, folik asit almaya ne zaman başladınız? Gebelik planlıyoruz ama henüz başlamadım.',
        category: 'pregnancy',
        comments: [
          { authorIdx: 3, content: 'Planlama aşamasında başladım, doktor en az 3 ay önce önermişti.' },
        ],
      },
    ];

    for (const p of postsData) {
      const post = await prisma.communityPost.create({
        data: {
          authorId: userIds[p.authorIdx],
          content: p.content,
          category: p.category,
          pregnancyWeek: p.pregnancyWeek ?? null,
          commentsCount: p.comments.length,
        },
      });
      for (const c of p.comments) {
        await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: userIds[c.authorIdx],
            content: c.content,
          },
        });
      }
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
