import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { foldTr } from '../common/text';

const INITIAL_BABY_NAMES = [
  // Kız İsimleri
  { name: 'Simay', gender: 'girl', meaning: 'Gümüş gibi parlak, ay gibi güzel ve ışıltılı', origin: 'Türkçe', isPopular: true },
  { name: 'Defne', gender: 'girl', meaning: 'Yaprakları güzel kokulu, defnegillerden bir ağaç; zafer ve başarı simgesi', origin: 'Yunanca', isPopular: true },
  { name: 'Zeynep', gender: 'girl', meaning: 'Babasının süsü, değerli taşlar ve mücevherler', origin: 'Arapça', isPopular: true },
  { name: 'Elif', gender: 'girl', meaning: 'Arap alfabesinin ilk harfi; ince, zarif ve dosdoğru', origin: 'Arapça', isPopular: true },
  { name: 'Asel', gender: 'girl', meaning: 'Cennetteki bal ırmağı, tatlı ve şifalı su', origin: 'Arapça', isPopular: true },
  { name: 'Lina', gender: 'girl', meaning: 'Cennetteki hurma fidesi, narin ve sevecen', origin: 'Arapça', isPopular: true },
  { name: 'Duru', gender: 'girl', meaning: 'Saf, berrak, temiz, pürüzsüz ve aydınlık', origin: 'Türkçe', isPopular: true },
  { name: 'Mina', gender: 'girl', meaning: 'Mekke’de kutsal tepe; şeffaf, saf cam ve gökyüzü', origin: 'Arapça', isPopular: true },
  { name: 'İpek', gender: 'girl', meaning: 'Yumuşak parlak lif; zarif, kibar ve asil kimse', origin: 'Türkçe', isPopular: true },
  { name: 'Masal', gender: 'girl', meaning: 'Eski hikâye, büyülü ve etkileyici anlatı', origin: 'Arapça', isPopular: true },
  { name: 'Alara', gender: 'girl', meaning: 'Mitolojide su perisi; al renkli güzel süs', origin: 'Türkçe', isPopular: true },
  { name: 'Alya', gender: 'girl', meaning: 'Yüksek yer, gökyüzü, dağ tepesi; asalet', origin: 'Arapça', isPopular: true },
  { name: 'Azra', gender: 'girl', meaning: 'El değmemiş, saf, bakire; Medine’nin bir ismi', origin: 'Arapça', isPopular: true },
  { name: 'Bade', gender: 'girl', meaning: 'Aşk şarabı, kutsal sevgi ve muhabbet', origin: 'Farsça', isPopular: true },
  { name: 'Beren', gender: 'girl', meaning: 'Güçlü, kuvvetli, akıllı ve tanınmış kimse', origin: 'Türkçe', isPopular: true },
  { name: 'Cemre', gender: 'girl', meaning: 'İlkbaharda havaya, suya ve toprağa düşen sıcaklık', origin: 'Arapça', isPopular: true },
  { name: 'Derin', gender: 'girl', meaning: 'Yüzeyi tabanından uzak olan; engin, özlü ve anlamlı', origin: 'Türkçe', isPopular: true },
  { name: 'Doğa', gender: 'girl', meaning: 'Tabiat, tüm canlı ve cansız varlıkların düzeni', origin: 'Türkçe', isPopular: true },
  { name: 'Dila', gender: 'girl', meaning: 'Gönlü aydınlatan, içten ve samimi sevgili', origin: 'Farsça', isPopular: true },
  { name: 'Ece', gender: 'girl', meaning: 'Kraliçe, sultan, saygıdeğer güzel kadın', origin: 'Türkçe', isPopular: true },
  { name: 'Ela', gender: 'girl', meaning: 'Sarıya çalan kestane rengi göz', origin: 'Türkçe', isPopular: true },
  { name: 'Ecrin', gender: 'girl', meaning: 'Allah’ın hediyesi, mükâfat, sevap', origin: 'Arapça', isPopular: true },
  { name: 'Eslem', gender: 'girl', meaning: 'Allah’a teslim olmuş, günahsız ve selamette olan', origin: 'Arapça', isPopular: true },
  { name: 'Gece', gender: 'girl', meaning: 'Günün batımından doğuşuna kadar süren dinginlik', origin: 'Türkçe', isPopular: false },
  { name: 'Gülce', gender: 'girl', meaning: 'Gül gibi, güle benzeyen, taze ve sevimli', origin: 'Türkçe', isPopular: false },
  { name: 'Güneş', gender: 'girl', meaning: 'Işık ve ısı yayan gök cismi, aydınlık saçan', origin: 'Türkçe', isPopular: false },
  { name: 'Hazal', gender: 'girl', meaning: 'Sonbaharda kuruyup dökülen ağaç yaprakları', origin: 'Türkçe', isPopular: false },
  { name: 'Hilal', gender: 'girl', meaning: 'Ayın ilk günlerdeki yay biçimi, yeni ay', origin: 'Arapça', isPopular: false },
  { name: 'Irmak', gender: 'girl', meaning: 'Büyük akarsu, nehir; bereket taşıyan su', origin: 'Türkçe', isPopular: false },
  { name: 'İdil', gender: 'girl', meaning: 'Kır yaşamını anlatan şiir; Volga Nehri', origin: 'Türkçe', isPopular: false },
  { name: 'İklim', gender: 'girl', meaning: 'Hava şartlarının genel durumu, ortam', origin: 'Arapça', isPopular: false },
  { name: 'İnci', gender: 'girl', meaning: 'İstiridyelerde oluşan değerli, parlak ve beyaz yuvarlak süs', origin: 'Türkçe', isPopular: true },
  { name: 'Kumsal', gender: 'girl', meaning: 'Deniz kıyısındaki kumlu alan; dinginlik', origin: 'Türkçe', isPopular: false },
  { name: 'Lara', gender: 'girl', meaning: 'Mitolojide su perisi; su gibi berrak', origin: 'Latince', isPopular: false },
  { name: 'Leyla', gender: 'girl', meaning: 'Karanlık ve uzun gece; saçları simsiyah güzel kadın', origin: 'Arapça', isPopular: true },
  { name: 'Melek', gender: 'girl', meaning: 'Masum, tertemiz ve iyilik timsali varlık', origin: 'Arapça', isPopular: false },
  { name: 'Melis', gender: 'girl', meaning: 'Bal arısı, bal gibi tatlı ve sevimli', origin: 'Yunanca', isPopular: true },
  { name: 'Merve', gender: 'girl', meaning: 'Mekke’de hacıların tavaf ettiği kutsal tepe; sert çakıl taşı', origin: 'Arapça', isPopular: true },
  { name: 'Mira', gender: 'girl', meaning: 'Kutup yıldızına yakın bir takımyıldız; kuyruklu yıldız', origin: 'Latince', isPopular: true },
  { name: 'Nehir', gender: 'girl', meaning: 'Büyük akarsu, coşkun akan hayat', origin: 'Arapça', isPopular: true },
  { name: 'Neva', gender: 'girl', meaning: 'Klasik Türk müziğinde bir makam; ahenk, ses, rızık', origin: 'Farsça', isPopular: false },
  { name: 'Nil', gender: 'girl', meaning: 'Afrika’nın can damarı olan ulu nehir; mavi su', origin: 'Mısırca', isPopular: true },
  { name: 'Pelin', gender: 'girl', meaning: 'Güzel kokulu ve şifalı bir dağ bitkisi', origin: 'Türkçe', isPopular: false },
  { name: 'Rüya', gender: 'girl', meaning: 'Düş, uykuda görülen güzel manzaralar; yüksek umut', origin: 'Arapça', isPopular: false },
  { name: 'Sare', gender: 'girl', meaning: 'Saf, temiz, prenses; Hz. İbrahim’in eşi', origin: 'İbranice', isPopular: true },
  { name: 'Selin', gender: 'girl', meaning: 'Gür akan tatlı su; övgü', origin: 'Türkçe', isPopular: false },
  { name: 'Sena', gender: 'girl', meaning: 'Övgü, şimşek parıltısı, aydınlık', origin: 'Arapça', isPopular: false },
  { name: 'Şevval', gender: 'girl', meaning: 'Hicri takvimde bayram ayı; yüce ve yüksek', origin: 'Arapça', isPopular: false },
  { name: 'Yağmur', gender: 'girl', meaning: 'Gökten düşen bereketli su damlaları', origin: 'Türkçe', isPopular: true },
  { name: 'Yade', gender: 'girl', meaning: 'Hatıra, anı, yadigar', origin: 'Farsça', isPopular: false },
  { name: 'Zehra', gender: 'girl', meaning: 'Çok beyaz ve parlak yüzlü; Hz. Fatıma’nın lakabı', origin: 'Arapça', isPopular: true },
  { name: 'Zümra', gender: 'girl', meaning: 'Cesur, zeki, ahlaklı ve güzel kadın topluluğu', origin: 'Arapça', isPopular: true },

  // Erkek İsimleri
  { name: 'Alparslan', gender: 'boy', meaning: 'Yiğit, cesur, korkusuz arslan; Selçuklu hükümdarı', origin: 'Türkçe', isPopular: true },
  { name: 'Kuzey', gender: 'boy', meaning: 'Dört ana yönden biri; kutup yıldızının yönü', origin: 'Türkçe', isPopular: true },
  { name: 'Poyraz', gender: 'boy', meaning: 'Kuzeydoğudan esen tazeleyici ve ferahlatıcı rüzgâr', origin: 'Yunanca', isPopular: true },
  { name: 'Kerem', gender: 'boy', meaning: 'Cömertlik, asalet, lütuf ve büyüklük', origin: 'Arapça', isPopular: true },
  { name: 'Metehan', gender: 'boy', meaning: 'Büyük Türk Hun İmparatoru; cesur lider', origin: 'Türkçe', isPopular: true },
  { name: 'Atlas', gender: 'boy', meaning: 'Mitolojide gök kubbeyi taşıyan güçlü dev; harita koleksiyonu', origin: 'Yunanca', isPopular: true },
  { name: 'Eymen', gender: 'boy', meaning: 'Uğurlu, bereketli, talihli ve sağ tarafta olan', origin: 'Arapça', isPopular: true },
  { name: 'Aras', gender: 'boy', meaning: 'Hazar Denizi’ne dökülen ulu nehir; sahip çıkılan değer', origin: 'Türkçe', isPopular: true },
  { name: 'Emir', gender: 'boy', meaning: 'Buyruk, komutan, lider, hanedan mensubu', origin: 'Arapça', isPopular: true },
  { name: 'Ali', gender: 'boy', meaning: 'Yüce, yüksek, onurlu ve üstün makam sahibi', origin: 'Arapça', isPopular: true },
  { name: 'Ayaz', gender: 'boy', meaning: 'Duru ve dingin kış havası, berrak soğuk', origin: 'Türkçe', isPopular: true },
  { name: 'Baran', gender: 'boy', meaning: 'Yağmur mevsimi; bereket ve diriliş', origin: 'Farsça', isPopular: false },
  { name: 'Barış', gender: 'boy', meaning: 'Huzur, uzlaşma, sükûnet ve dostluk', origin: 'Türkçe', isPopular: false },
  { name: 'Batuhan', gender: 'boy', meaning: 'Üstün gelen, güçlü hükümdar', origin: 'Türkçe', isPopular: false },
  { name: 'Bora', gender: 'boy', meaning: 'Ardından yağmur getiren sert ve şiddetli rüzgâr', origin: 'Türkçe', isPopular: false },
  { name: 'Burak', gender: 'boy', meaning: 'Şimşek gibi hızlı ve nurlu binek; bereket', origin: 'Arapça', isPopular: true },
  { name: 'Can', gender: 'boy', meaning: 'Ruh, hayat, içten ve samimi sevgili', origin: 'Farsça', isPopular: false },
  { name: 'Cem', gender: 'boy', meaning: 'Hükümdar; toplanma ve birlik oluşturma', origin: 'Farsça', isPopular: false },
  { name: 'Cihan', gender: 'boy', meaning: 'Dünya, alem, kainat ve evren', origin: 'Farsça', isPopular: false },
  { name: 'Çağan', gender: 'boy', meaning: 'Bayram, şenlik, neşeli ve mutlu gün', origin: 'Türkçe', isPopular: false },
  { name: 'Çınar', gender: 'boy', meaning: 'Uzun ömürlü, ulu, heybetli ve köklü ağaç', origin: 'Farsça', isPopular: true },
  { name: 'Demir', gender: 'boy', meaning: 'Dayanıklı, güçlü, sert ve sarsılmaz element', origin: 'Türkçe', isPopular: false },
  { name: 'Deniz', gender: 'boy', meaning: 'Büyük su kütlesi; sonsuzluk, enginlik ve ferahlık', origin: 'Türkçe', isPopular: true },
  { name: 'Doruk', gender: 'boy', meaning: 'Dağın en yüksek noktası, zirve, başarı', origin: 'Türkçe', isPopular: true },
  { name: 'Efe', gender: 'boy', meaning: 'Yiğit, cesur ağabey, mert ve sözünün eri kimse', origin: 'Türkçe', isPopular: true },
  { name: 'Ege', gender: 'boy', meaning: 'Bir çocuğu koruyan, bilge ulu kişi; Ege Denizi', origin: 'Türkçe', isPopular: true },
  { name: 'Emre', gender: 'boy', meaning: 'Aşık, tutkun, dost ve kardeş', origin: 'Türkçe', isPopular: false },
  { name: 'Enes', gender: 'boy', meaning: 'İnsan, dost canlısı, sevecen ve cana yakın', origin: 'Arapça', isPopular: true },
  { name: 'Görkem', gender: 'boy', meaning: 'Göz alıcı ve heybetli görünüş, ihtişam', origin: 'Türkçe', isPopular: false },
  { name: 'Hakan', gender: 'boy', meaning: 'Eski Türk hükümdarı, kağanların başı', origin: 'Türkçe', isPopular: false },
  { name: 'Kaan', gender: 'boy', meaning: 'Hükümdar, hanların hanı, kralların kralı', origin: 'Türkçe', isPopular: true },
  { name: 'Kayra', gender: 'boy', meaning: 'Yüksek bir makamdan gelen iyilik, lütuf ve ihsan', origin: 'Türkçe', isPopular: true },
  { name: 'Korkut', gender: 'boy', meaning: 'Büyük ulu kişi, bilge dede; heybetli', origin: 'Türkçe', isPopular: false },
  { name: 'Meriç', gender: 'boy', meaning: 'Balkanlar’dan doğup Ege’ye akan ulu nehir', origin: 'Türkçe', isPopular: false },
  { name: 'Mirza', gender: 'boy', meaning: 'Hükümdar soyundan gelen, beyzade', origin: 'Farsça', isPopular: false },
  { name: 'Oğuz', gender: 'boy', meaning: 'Sağlam, güçlü, dürüst ve temiz yaratılışlı kimse', origin: 'Türkçe', isPopular: false },
  { name: 'Ömer', gender: 'boy', meaning: 'Canlılık, hayat dolu, adalet timsali halife', origin: 'Arapça', isPopular: true },
  { name: 'Pamir', gender: 'boy', meaning: 'Dünyanın çatısı olarak bilinen ulu dağ silsilesi', origin: 'Türkçe', isPopular: false },
  { name: 'Rüzgar', gender: 'boy', meaning: 'Havanın akışı, hız, zaman, özgürlük ve dinamizm', origin: 'Farsça', isPopular: true },
  { name: 'Sarp', gender: 'boy', meaning: 'Geçilmesi ve tırmanılması güç, dik ve yalçın tepe', origin: 'Türkçe', isPopular: false },
  { name: 'Selim', gender: 'boy', meaning: 'Sağlam, kusursuz, temiz ve doğru karakterli', origin: 'Arapça', isPopular: false },
  { name: 'Taha', gender: 'boy', meaning: 'Kur’an-ı Kerim’de bir sure; Hz. Peygamber’in isimlerinden', origin: 'Arapça', isPopular: true },
  { name: 'Toprak', gender: 'boy', meaning: 'Bereketi simgeleyen ana element, can veren zemin', origin: 'Türkçe', isPopular: true },
  { name: 'Tuna', gender: 'boy', meaning: 'Avrupa’yı baştan başa geçen görkemli ulu nehir', origin: 'Türkçe', isPopular: false },
  { name: 'Umut', gender: 'boy', meaning: 'Geleceğe dair güzel beklenti, umut ışığı', origin: 'Türkçe', isPopular: false },
  { name: 'Yalın', gender: 'boy', meaning: 'Sade, gösterişsiz, açık, duru ve içten', origin: 'Türkçe', isPopular: false },
  { name: 'Yaman', gender: 'boy', meaning: 'Becerikli, güçlü, cesur, zeki ve üstün', origin: 'Türkçe', isPopular: false },
  { name: 'Yasin', gender: 'boy', meaning: 'Kur’an’ın kalbi olarak anılan mübarek sure', origin: 'Arapça', isPopular: true },
  { name: 'Yiğit', gender: 'boy', meaning: 'Cesur, mert, güçlü, alp ve yürekli kimse', origin: 'Türkçe', isPopular: true },
  { name: 'Yusuf', gender: 'boy', meaning: 'Güzelliğin sembolü peygamber; inleyen, ah eden', origin: 'İbranice', isPopular: true },

  // Uniseks İsimleri
  { name: 'Arya', gender: 'unisex', meaning: 'Soylu, asil kimse; operada solo ezgi', origin: 'Sanskritçe', isPopular: true },
  { name: 'Ada', gender: 'unisex', meaning: 'Dört tarafı suyla çevrili huzurlu kara parçası', origin: 'Türkçe', isPopular: true },
  { name: 'Bilge', gender: 'unisex', meaning: 'Çok bilgili, derin anlayışlı ve hikmet sahibi', origin: 'Türkçe', isPopular: false },
  { name: 'Çağla', gender: 'unisex', meaning: 'Badem, erik gibi meyvelerin ham hali; coşkulu çağlayan', origin: 'Türkçe', isPopular: false },
  { name: 'Devrim', gender: 'unisex', meaning: 'Büyük değişim, yenilenme ve ilerleme', origin: 'Türkçe', isPopular: false },
  { name: 'Duru', gender: 'unisex', meaning: 'Berrak, tertemiz ve katıksız güzellik', origin: 'Türkçe', isPopular: true },
  { name: 'Eren', gender: 'unisex', meaning: 'Ermiş, olgunlaşmış, bilge ve gönül gözü açık', origin: 'Türkçe', isPopular: false },
  { name: 'Evren', gender: 'unisex', meaning: 'Kainat, var olan her şeyin bütünü; gök ejderhası', origin: 'Türkçe', isPopular: false },
  { name: 'Göksu', gender: 'unisex', meaning: 'Gökten inen berrak su; güzel nehir', origin: 'Türkçe', isPopular: false },
  { name: 'Güneş', gender: 'unisex', meaning: 'Aydınlatan ve hayat veren ana enerji kaynağı', origin: 'Türkçe', isPopular: true },
  { name: 'Ilgaz', gender: 'unisex', meaning: 'Anadolu’nun görkemli ulu dağı; atın dörtnala koşması', origin: 'Türkçe', isPopular: false },
  { name: 'Mavi', gender: 'unisex', meaning: 'Gökyüzü ve denizin rengi; sonsuzluk, barış ve huzur', origin: 'Türkçe', isPopular: true },
  { name: 'Meriç', gender: 'unisex', meaning: 'Balkanlar’ın ulu ve bereketli nehri', origin: 'Türkçe', isPopular: false },
  { name: 'Ömür', gender: 'unisex', meaning: 'Hayat, yaşama süresi, varoluş', origin: 'Arapça', isPopular: false },
  { name: 'Rüzgar', gender: 'unisex', meaning: 'Havanın hareketi, özgürlük ve tazelik', origin: 'Farsça', isPopular: true },
  { name: 'Sezgi', gender: 'unisex', meaning: 'İçgüdü, kalbe doğan his, sezme kabiliyeti', origin: 'Türkçe', isPopular: false },
  { name: 'Toprak', gender: 'unisex', meaning: 'Bereketi simgeleyen ana element', origin: 'Türkçe', isPopular: true },
  { name: 'Umut', gender: 'unisex', meaning: 'Geleceğe duyulan sarsılmaz inanç ve beklenti', origin: 'Türkçe', isPopular: true },
  { name: 'Uzay', gender: 'unisex', meaning: 'Gök varlıklarının içinde bulunduğu sonsuz boşluk', origin: 'Türkçe', isPopular: false },
  { name: 'Yağmur', gender: 'unisex', meaning: 'Gökten inen hayat kaynağı bereket damlaları', origin: 'Türkçe', isPopular: true },
  { name: 'Yankı', gender: 'unisex', meaning: 'Sesin bir engelden geri dönmesi, aks-i seda', origin: 'Türkçe', isPopular: false },
  // Ek kız isimleri
  { name: 'Aylin', gender: 'girl', meaning: 'Ay gibi parlak ve narin', origin: 'Türkçe', isPopular: true },
  { name: 'Buse', gender: 'girl', meaning: 'Rüzgar gibi hafif ve özgür', origin: 'Türkçe', isPopular: true },
  { name: 'Cansu', gender: 'girl', meaning: 'Can gibi değerli su, hayat kaynağı', origin: 'Türkçe', isPopular: true },
  { name: 'Damla', gender: 'girl', meaning: 'Su damlası, incelik ve saflık', origin: 'Türkçe', isPopular: true },
  { name: 'Eylül', gender: 'girl', meaning: 'Sonbaharın bereketli mevsimi', origin: 'Türkçe', isPopular: true },
  { name: 'Feyza', gender: 'girl', meaning: 'Fazilet sahibi, erdemli ve güzel', origin: 'Arapça', isPopular: true },
  { name: 'Gizem', gender: 'girl', meaning: 'Sır, esrarengiz güzellik', origin: 'Türkçe', isPopular: true },
  { name: 'Hande', gender: 'girl', meaning: 'Gülümser, neşeli ve cana yakın', origin: 'Farsça', isPopular: true },
  { name: 'Ilgın', gender: 'girl', meaning: 'Ilık rüzgar, yumuşak ve sıcak', origin: 'Türkçe', isPopular: false },
  { name: 'Jale', gender: 'girl', meaning: 'Çiğ damlası, sabah çiğinin saflığı', origin: 'Farsça', isPopular: false },
  { name: 'Kardelen', gender: 'girl', meaning: 'Kışın kar altında açan narin çiçek', origin: 'Türkçe', isPopular: true },
  { name: 'Lale', gender: 'girl', meaning: 'Bahçe çiçeği, zarafet ve bahar', origin: 'Farsça', isPopular: true },
  { name: 'Nazlı', gender: 'girl', meaning: 'Naz yapan, sevimli ve çekingen', origin: 'Türkçe', isPopular: true },
  { name: 'Oya', gender: 'girl', meaning: 'El işi süsleme; yaratıcılık ve incelik', origin: 'Türkçe', isPopular: false },
  { name: 'Pınar', gender: 'girl', meaning: 'Kaynaktan çıkan temiz su', origin: 'Türkçe', isPopular: true },
  { name: 'Rana', gender: 'girl', meaning: 'Göz alıcı, cazibeli ve çekici', origin: 'Arapça', isPopular: false },
  { name: 'Su', gender: 'girl', meaning: 'Hayat kaynağı, berraklık ve akış', origin: 'Türkçe', isPopular: true },
  { name: 'Tuana', gender: 'girl', meaning: 'İlk kez görülen kuyruklu yıldız', origin: 'Türkçe', isPopular: true },
  { name: 'Umay', gender: 'girl', meaning: 'Türk mitolojisinde çocuk koruyucu ana tanrıça', origin: 'Türkçe', isPopular: true },
  { name: 'Vildan', gender: 'girl', meaning: 'Yabani gül, doğal güzellik', origin: 'Arapça', isPopular: false },
  // Ek erkek isimleri
  { name: 'Aras', gender: 'boy', meaning: 'Eşit, dengeli; Türkiye-Iran sınırındaki nehir', origin: 'Türkçe', isPopular: true },
  { name: 'Baran', gender: 'boy', meaning: 'Yağmur, bereket ve bolluk', origin: 'Türkçe', isPopular: true },
  { name: 'Cem', gender: 'boy', meaning: 'Toplantı, bir araya gelme; topluluk', origin: 'Arapça', isPopular: true },
  { name: 'Deniz', gender: 'boy', meaning: 'Engin deniz, özgürlük ve derinlik', origin: 'Türkçe', isPopular: true },
  { name: 'Emre', gender: 'boy', meaning: 'Dost, aşık, sevgili ve sadık', origin: 'Türkçe', isPopular: true },
  { name: 'Fırat', gender: 'boy', meaning: 'Mezopotamya\'nın bereketli nehri', origin: 'Türkçe', isPopular: true },
  { name: 'Gökhan', gender: 'boy', meaning: 'Gök hakanı, gökyüzü hükümdarı', origin: 'Türkçe', isPopular: true },
  { name: 'Hakan', gender: 'boy', meaning: 'Hükümdar, kağan, lider', origin: 'Türkçe', isPopular: true },
  { name: 'İlker', gender: 'boy', meaning: 'Ulusun erki, milletin gücü', origin: 'Türkçe', isPopular: true },
  { name: 'Kaan', gender: 'boy', meaning: 'Hükümdar, han; güçlü lider', origin: 'Türkçe', isPopular: true },
  { name: 'Levent', gender: 'boy', meaning: 'Denizci, cesur ve maceracı', origin: 'Türkçe', isPopular: true },
  { name: 'Mert', gender: 'boy', meaning: 'Yiğit, cesur, erdemli ve dürüst', origin: 'Türkçe', isPopular: true },
  { name: 'Onur', gender: 'boy', meaning: 'Şeref, gurur ve haysiyet', origin: 'Türkçe', isPopular: true },
  { name: 'Polat', gender: 'boy', meaning: 'Çelik gibi sağlam ve güçlü', origin: 'Türkçe', isPopular: true },
  { name: 'Serkan', gender: 'boy', meaning: 'Kan bahtı açık, şanslı ve bahtiyar', origin: 'Türkçe', isPopular: true },
  { name: 'Tolga', gender: 'boy', meaning: 'Savaş miğferi; koruma ve güç', origin: 'Türkçe', isPopular: true },
  { name: 'Umut', gender: 'boy', meaning: 'Beklenti, geleceğe güven', origin: 'Türkçe', isPopular: true },
  { name: 'Volkan', gender: 'boy', meaning: 'Yanardağ; güçlü ve tutkulu', origin: 'Türkçe', isPopular: true },
  { name: 'Yiğit', gender: 'boy', meaning: 'Cesur, mert ve kahraman', origin: 'Türkçe', isPopular: true },
  { name: 'Zeki', gender: 'boy', meaning: 'Akıllı, zihni açık ve kavrayışlı', origin: 'Arapça', isPopular: true },
  // Ek unisex
  { name: 'Derin', gender: 'unisex', meaning: 'Engin, anlamlı ve derin', origin: 'Türkçe', isPopular: true },
  { name: 'Evren', gender: 'unisex', meaning: 'Kainat, sonsuz boşluk ve bütün', origin: 'Türkçe', isPopular: true },
  { name: 'Güneş', gender: 'unisex', meaning: 'Işık ve sıcaklık kaynağı', origin: 'Türkçe', isPopular: true },
  { name: 'Özgür', gender: 'unisex', meaning: 'Hür, bağımsız ve özgür irade', origin: 'Türkçe', isPopular: true },
];

@Injectable()
export class PregnancyService {
  constructor(private readonly prisma: PrismaService) {}

  private getLetterFromBaby(week: number, babyName?: string | null): string {
    const name = babyName ? babyName : 'minik bebeğin';
    
    // Comprehensive letters for each specific week 1 to 40
    const letters: Record<number, string> = {
      1: `Merhaba anneciğim! Henüz yolculuğun en başındayız. Vücudun beni ağırlamak için muhteşem bir mucizeye hazırlanıyor. Senin sevginle büyüyeceğim! 💕`,
      2: `Anneciğim, hücrelerim bir araya geliyor ve hayatımın ilk kıvılcımı parlıyor. Birlikte harika bir serüvene başlıyoruz! ✨`,
      3: `Artık resmen senin içindeyim anne! Rahim duvarına sımsıkı tutundum. Kalbimin ilk hücreleri şimdiden senin için atmaya hazırlanıyor. 🌸`,
      4: `Anneciğim, minicik bir haşhaş tohumu kadarsın belki ama içimde devasa bir yaşam filizleniyor. Kalp atışımın ilk ritimleri oluşuyor! 🌱`,
      5: `Kalbim artık minik bir pompa gibi düzenli olarak atıyor anne! Beynim, omurgam ve kan damarlarım hızla gelişiyor. Sana sımsıkı bağlıyım. 💓`,
      6: `Boyum bir mercimek tanesi kadar oldu! Minik gözlerim, burnum ve kulaklarım şekilleniyor. Varlığımı hissetmeye başladın mı? 🫐`,
      7: `Anneciğim, kollarım ve bacaklarım minik tomurcuklar gibi uzuyor. Beynimde her dakika yüz binlerce yeni nöron oluşuyor! 🧠✨`,
      8: `Artık bir ahududu büyüklüğündeyim! Parmaklarım ayrışmaya başladı ve minik hareketler yapıyorum. Seni çok seviyorum anne! 🍓`,
      9: `Göz kapaklarım ve kulak kepçelerim belirginleşti. Minik kalbimin sesini ultrasonda duymak için sabırsızlanıyor musun? 🎵`,
      10: `Embriyo dönemini bitirdik anne, artık resmi olarak bir fetüsüm! Boyum bir kuru erik kadar oldu. Bütün hayati organlarım yerli yerinde! 🍑`,
      11: `Anneciğim, ellerimi açıp kapayabiliyorum, parmaklarımı emmeye başladım! Boyum bir incir kadar oldu. Birlikte günden güne güçleniyoruz. 🌿`,
      12: `İlk trimesteri tamamladık! Artık ses tellerim ve tırnaklarım bile var. Senin içindeki güvenli yuvamda çok mutluyum anneciğim. 🥑`,
      13: `İkinci trimestere hoş geldin anne! Artık parmak izlerim oluştu, dünyada benden bir tane daha yok! Senin minik mucizenim. 👣`,
      14: `Yüz kaslarımı hareket ettirebiliyorum; gülümsüyor ve kaşlarımı çatıyorum! Boyum bir limon kadar oldu. 🍋`,
      15: `Anneciğim, ışığı ve karanlığı ayırt edebiliyorum. Bacaklarım uzadı, içeride sürekli taklalar atıyorum! 🤸‍♀️`,
      16: `Artık senin sesini ve kalp atışını duyabiliyorum anne! Bana şarkılar söyle, konuştukça sesini tanıyor ve huzur buluyorum. Bir avokado boyutundayım! 🥑✨`,
      17: `İskeletim güçleniyor, minik kemiklerim kıkırdaktan kemiğe dönüşüyor. Yağ dokum oluşmaya başladı! 🦴`,
      18: `Anneciğim, esniyor, hıçkırıyor ve parmaklarımı emiyorum. Ultrasonda sana el sallayabilirim! 🖐️`,
      19: `Cildim verniks adı verilen koruyucu bir tabakayla kaplanıyor. Saçlarım çıkmaya başladı anne! Bir mango büyüklüğündeyim. 🥭`,
      20: `Yolu yarıladık anneciğim! Tam 20 haftalık oldum. Minik tekmelerimi karnında hissetmeye başladın mı? Ben buradayım! 🦶💕`,
      21: `Anneciğim, yutkunma hareketleri yapıyorum ve sindirim sistemim pratik yapıyor. Senin sesin en sevdiğim ninni! 🍼`,
      22: `Dokunma duyum tamamen gelişti; yüzüme, göbek kordonuma dokunup dünyamı keşfediyorum. Bir papaya kadar büyüdüm! 🍈`,
      23: `Dış dünyadaki ani sesleri duyup irkilebiliyorum anne. Senin kokun ve sıcaklığın bana her an güven veriyor. 🎧`,
      24: `Göz kapaklarımı aralayabiliyorum ve akciğerlerimde hava kesecikleri gelişiyor. Bir mısır koçanı kadar oldum! 🌽`,
      25: `Anneciğim, tenimin rengi ve saçlarım iyice belirginleşti. Karnını okşadığında sana tekme atarak yanıt verebilirim! 🖐️✨`,
      26: `Gözlerimi açıp kapatabiliyorum, uyku ve uyanıklık ritmim oluştu. Birlikte uyuyup birlikte uyanıyoruz anne! 🌙`,
      27: `İkinci trimesteri bitiriyoruz! Boyum bir karnabahar kadar oldu. Beynim hızla gelişmeye devam ediyor. 🥦`,
      28: `Üçüncü trimestere ve son dönemece girdik anneciğim! Artık rüyalar görebiliyorum. Rüyalarımda sana kavuştuğum anı görüyorum. 💭✨`,
      29: `Kemiklerim güçleniyor, bol bol kalsiyum al anneciğim! Minik tekmelerim artık dışarıdan da rahatça görülüyor. 🦶`,
      30: `Boyum bir lahana kadar oldu! Seni ve babamı dinliyorum, dünyadaki sesleri hafızama kaydediyorum. 🥬`,
      31: `Anneciğim, beş duyum da aktif! Işığa tepki veriyor, tatları ayırt edebiliyorum. Senin kucağına gelmek için sabırsızlanıyorum. 🌸`,
      32: `Tırnaklarım parmak uçlarıma kadar uzadı. Baş aşağı doğum pozisyonuna geçmeye hazırlanıyorum anne! 🧘‍♀️`,
      33: `Bağışıklık sistemim senin antikorlarınla güçleniyor. Alanım biraz daralsa da seni çok sevdiğimi hissettiriyorum! 🍯`,
      34: `Akciğerlerim neredeyse tamamen olgunlaştı anne. Bir kavun büyüklüğündeyim! Doğum çantan hazır mı? 🍈🎒`,
      35: `Böbreklerim ve karaciğerim tamamen çalışıyor. Artık kilo alıp tombullaşıyorum anneciğim! 👶`,
      36: `36 haftayı devirdik! Artık her an gelebilirim ama biraz daha kilo alıp güçleniyorum. Seninle tanışmaya çok az kaldı! ⏳`,
      37: `Erken doğum riskini aştık anne, artık miadında bir bebeğim! Saçlarım, kirpiklerim ve tırnaklarım kusursuz. 🌟`,
      38: `Boyum bir karpuz kadar oldu anne! Organlarım dış dünyadaki ilk nefese tamamen hazır. Seni çok seviyorum. 🍉`,
      39: `Kavuşmamıza günler kaldı anneciğim! Kalp atışlarımı dinle, ben senin kollarında huzurla uyuyacağım günü bekliyorum. 💕`,
      40: `Mucizemiz tamamlandı anne! 40 haftalık serüvenimiz bitti, artık senin sıcacık kucağına geliyorum. Hoş buldum canım annem! 🎉👶✨`,
    };

    return letters[week] || `Anneciğim ${week}. haftamdayım! Her geçen gün büyüyorum ve seni çok seviyorum. Dünyaya geleceğim günü sabırsızlıkla bekliyorum! 💕`;
  }

  async createPregnancy(userId: string, lmpStr: string, babyName?: string) {
    const existing = await this.prisma.pregnancy.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Zaten aktif bir gebelik kaydınız var');

    const lmp = new Date(lmpStr);
    const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000); // Naegele's rule
    const { week, day } = this.calculateWeekDay(lmp);

    const pregnancy = await this.prisma.pregnancy.create({
      data: { userId, lastMenstrualPeriod: lmp, dueDate, babyName: babyName?.trim() || null },
    });

    const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
    const totalDays = 280;
    const elapsed = totalDays - daysRemaining;
    const progressPercent = Math.min(100, Math.round((elapsed / totalDays) * 100));
    const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

    return {
      id: pregnancy.id, lastMenstrualPeriod: pregnancy.lastMenstrualPeriod,
      dueDate: pregnancy.dueDate, babyName: pregnancy.babyName,
      currentWeek: week, currentDay: day, daysRemaining, trimester, progressPercent,
      isActive: pregnancy.isActive, createdAt: pregnancy.createdAt,
    };
  }

  async updatePregnancy(userId: string, lmpStr?: string, babyName?: string) {
    const current = await this.prisma.pregnancy.findUnique({ where: { userId } });
    const lmp = lmpStr ? new Date(lmpStr) : current?.lastMenstrualPeriod || new Date();
    const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    const { week, day } = this.calculateWeekDay(lmp);

    const pregnancy = await this.prisma.pregnancy.upsert({
      where: { userId },
      update: {
        lastMenstrualPeriod: lmp,
        dueDate,
        ...(babyName !== undefined && { babyName: babyName?.trim() || null }),
        isActive: true,
      },
      create: {
        userId,
        lastMenstrualPeriod: lmp,
        dueDate,
        babyName: babyName?.trim() || null,
        isActive: true,
      },
    });

    const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
    const totalDays = 280;
    const elapsed = totalDays - daysRemaining;
    const progressPercent = Math.min(100, Math.round((elapsed / totalDays) * 100));
    const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

    return {
      id: pregnancy.id, lastMenstrualPeriod: pregnancy.lastMenstrualPeriod, dueDate: pregnancy.dueDate,
      babyName: pregnancy.babyName,
      currentWeek: week, currentDay: day, daysRemaining, trimester, progressPercent,
      isActive: pregnancy.isActive, createdAt: pregnancy.createdAt,
    };
  }

  async setBabyName(userId: string, babyName: string) {
    return this.updatePregnancy(userId, undefined, babyName);
  }

  async getPregnancy(userId: string) {
    const p = await this.prisma.pregnancy.findUnique({ where: { userId } });
    if (!p) return null;

    const { week, day } = this.calculateWeekDay(p.lastMenstrualPeriod);
    const daysRemaining = Math.max(0, Math.ceil((p.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
    const totalDays = 280;
    const elapsed = totalDays - daysRemaining;
    const progressPercent = Math.min(100, Math.round((elapsed / totalDays) * 100));
    const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

    return {
      id: p.id, lastMenstrualPeriod: p.lastMenstrualPeriod, dueDate: p.dueDate,
      babyName: p.babyName,
      currentWeek: week, currentDay: day, daysRemaining, trimester, progressPercent,
      isActive: p.isActive, createdAt: p.createdAt,
    };
  }

  async deletePregnancy(userId: string) {
    await this.prisma.pregnancy.deleteMany({ where: { userId } });
    return { success: true };
  }

  async getWeekContent(weekNumber: number, userId?: string) {
    let babyName: string | null = null;
    if (userId) {
      const p = await this.prisma.pregnancy.findUnique({ where: { userId } });
      babyName = p?.babyName ?? null;
    }

    const content = await this.prisma.pregnancyWeekContent.findUnique({ where: { weekNumber } });
    const letter = content?.letterFromBaby || this.getLetterFromBaby(weekNumber, babyName);

    if (!content) {
      return {
        weekNumber,
        title: `${weekNumber}. Hafta`,
        babyDevelopment: 'Bebeğiniz her geçen gün büyümeye ve gelişmeye devam ediyor.',
        babySize: 'Büyüyor',
        babyWeight: '-',
        organDevelopment: 'Hücresel gelişim sürüyor.',
        motherChanges: 'Vücudunuz bu mucizevi değişime uyum sağlıyor.',
        letterFromBaby: letter,
        commonSymptoms: [],
        tips: ['Bol su için ve dinlenin.'],
        warnings: [],
      };
    }

    return {
      ...content,
      letterFromBaby: letter,
    };
  }

  async getAllWeeks() {
    const weeks = await this.prisma.pregnancyWeekContent.findMany({
      select: { weekNumber: true, title: true, babySize: true },
      orderBy: { weekNumber: 'asc' },
    });
    return { weeks };
  }

  async getBabyNames(gender?: string, search?: string) {
    let list = INITIAL_BABY_NAMES;

    if (gender && gender !== 'all') {
      list = list.filter(item => item.gender === gender || item.gender === 'unisex');
    }

    if (search && search.trim()) {
      const q = foldTr(search).trim();
      list = list.filter(item => foldTr(item.name).includes(q) || foldTr(item.meaning).includes(q));
    }

    return {
      items: list.map((item, idx) => ({ id: `bn-${idx + 1}`, ...item })),
      total: list.length,
    };
  }

  async syncPostpartumReminders(userId: string, birthDateStr: string) {
    const birth = new Date(birthDateStr);
    if (Number.isNaN(birth.getTime())) return { day: null, created: 0, tasks: [] as Array<{ id: string; title: string; body: string }> };

    const day = Math.floor((Date.now() - birth.getTime()) / (24 * 60 * 60 * 1000));
    const catalog: Array<{ id: string; dayFrom: number; dayTo: number; title: string; body: string }> = [
      { id: 'd0-rest', dayFrom: 0, dayTo: 1, title: 'Ten tene ve kanama kontrolü', body: 'Bebeği göğsünüze alın. 1 saatte bir ped dolduran kanama acildir.' },
      { id: 'd0-latch', dayFrom: 0, dayTo: 2, title: 'İlk 48 saat emzirme', body: 'Colostrum yeterlidir. 24 saatte en az 8 emzirme hedefleyin.' },
      { id: 'd3-milk', dayFrom: 3, dayTo: 5, title: 'Süt dolması', body: 'Göğüsler dolabilir. Tek tarafta kızarıklık ve ateş mastit olabilir.' },
      { id: 'd3-jaundice', dayFrom: 3, dayTo: 5, title: 'Bebek sarılığı', body: 'Az emen, zor uyandırılan veya ıslak bezi az bebek aynı gün hekime.' },
      { id: 'd7-blues', dayFrom: 7, dayTo: 14, title: 'Ruh hali izlemi', body: '2 haftayı geçen umutsuzluk veya kendine/bebeğe zarar düşüncesi acil destektir.' },
      { id: 'd15-bleeding', dayFrom: 14, dayTo: 21, title: 'Löşi azalmalı', body: 'Parlak kırmızı kanamanın geri gelmesi veya kötü koku için kadın doğuma gidin.' },
      { id: 'd28-baby', dayFrom: 28, dayTo: 35, title: '1. ay izlem ve 2. ay aşı randevusu', body: 'Bebek tartımı ve 60. gün BCG/karma/KPA randevusunu alın.' },
      { id: 'd40-lohusa', dayFrom: 40, dayTo: 42, title: '6. hafta lohusa muayenesi', body: 'Yara, tansiyon, duygu durumu ve aile planlaması için kontrol günü.' },
    ];

    const todayTasks = day < 0 || day > 50 ? [] : catalog.filter((t) => day >= t.dayFrom && day <= t.dayTo);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    let created = 0;

    for (const task of todayTasks) {
      const existing = await this.prisma.notification.findFirst({
        where: { userId, type: 'postpartum_task', referenceId: task.id, createdAt: { gte: startOfDay } },
      });
      if (existing) continue;
      await this.prisma.notification.create({
        data: {
          userId,
          type: 'postpartum_task',
          title: `Lohusalık ${day}. gün: ${task.title}`,
          body: task.body,
          module: 'pregnancy',
          referenceId: task.id,
        },
      });
      created++;
    }

    return { day, created, tasks: todayTasks.map((t) => ({ id: t.id, title: t.title, body: t.body })) };
  }

  calculateWeekDay(lmp: Date) {
    const diffMs = Date.now() - lmp.getTime();
    const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const week = Math.floor(totalDays / 7) + 1;
    const day = (totalDays % 7) + 1;
    return { week: Math.max(1, Math.min(42, week)), day: Math.max(1, Math.min(7, day)) };
  }
}
