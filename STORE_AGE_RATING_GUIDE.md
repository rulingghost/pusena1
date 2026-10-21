# Pusena (Bloom) — Mağaza Yaş Derecelendirmesi ve Çocuk Güvenliği Rehberi

Bu rehber, **Pusena** uygulamasının Google Play Console (IARC) ve Apple App Store Connect üzerindeki içerik ve yaş derecelendirmesi (Content Rating) anketlerinin hatasız doldurulması, hedef kitle tanımlaması ve çocuk güvenliği politikalarının doğrulanması için hazırlanmıştır.

---

## 1. Uygulama Kapsamı ve Kategori Tanımı

- **Birincil Kategori:** Sağlık ve Fitness (Health & Fitness) / Yaşam Tarzı (Lifestyle).
- **İkincil Kategori:** Sosyal / Çift İletişimi (Social & Relationships).
- **Hedef Kitle:** Genç yetişkinler ve yetişkin kadınlar (16 yaş ve üzeri) ile partnerleri.
- **Çocuk Odaklılık:** Uygulama **çocuklara yönelik değildir**; 13 yaşından küçük kullanıcıları hedeflemez (COPPA ve Google Play Families Policy kapsamı dışındadır).

---

## 2. Google Play Console — IARC Anketi Soru ve Cevapları

Google Play'de İçerik Derecelendirmesi (Content Rating) sekmesinde yer alan IARC (International Age Rating Coalition) anketinde verilecek resmi cevaplar:

| Soru / Alan | Verilecek Cevap | Gerekçe & Mağaza Notu |
| :--- | :--- | :--- |
| **Uygulama Kategorisi** | *Sosyal veya İletişim / Sağlık* | Kullanıcılar arası etkileşim, regl ve gebelik sağlık takibi içerir. |
| **Şiddet / Korku / Kan** | **Hayır** | Uygulamada hiçbir şiddet, kan veya korku unsuru bulunmaz. |
| **Cinsellik & Çıplaklık** | **Hayır** | Müstehcen veya erotik içerik yoktur; regl, yumurtlama ve gebelik konuları yalnızca **tıbbi/biyolojik referans** niteliğindedir. |
| **Kaba Dil / Küfür** | **Hayır** | Uygulama moderasyon kuralları ve şikayet mekanizması ile küfür engellenir. |
| **Kontrollü Maddeler (Alkol/Tütün/Uyuşturucu)** | **Hayır** | Tütün, alkol veya uyuşturucu teşviki bulunmaz. |
| **Kullanıcı Etkileşimi (Users Interact)** | **Evet** | Topluluk gönderileri, yorumlar ve eşleşmiş partner sohbeti mevcuttur. |
| **Konum Paylaşımı** | **Evet** | Yalnızca eşleşilmiş partner ile açık rıza sonrası yaklaşık/canlı konum paylaşılır. |
| **Dijital Satın Alma (In-App Purchases)** | **Hayır** | İlk sürümde tüm özellikler ücretsiz erken erişim olarak sunulmaktadır. |

### 📌 Beklenen IARC Sonuçları:
- **Google Play:** **Teen (13+) veya 16+** (Topluluk etkileşimi ve üreme sağlığı biyolojisi nedeniyle).
- **PEGI (Avrupa):** **PEGI 16** ("Kullanıcılar Arası Etkileşim").
- **ESRB (Kuzey Amerika):** **Teen (13+)** ("Users Interact", "Shares Location").

---

## 3. Apple App Store Connect — Yaş Derecelendirmesi Anketi

Apple App Store Connect'te *App Information > Age Rating* anketindeki resmi cevaplar:

| Konu | Seçim | Apple İnceleme Gerekçesi |
| :--- | :--- | :--- |
| **Tıbbi / Tedavi Bilgisi** | **Seyrek / Hafif (Infrequent/Mild)** | Adet döngüsü, doğurganlık günleri, gebelik haftası ve semptom takip ipuçları. |
| **Cinsel İçerik veya Çıplaklık** | **Yok veya Seyrek (Tıbbi/Eğitim)** | Üreme sağlığı ve ovülasyon biyolojisi. |
| **Kullanıcı Tarafından Oluşturulan İçerik (UGC)** | **Evet** | Topluluk forumu ve yorumlar; şikayet (`report`) ve engelleme (`block`) özellikleri devrede. |
| **Serbest Web Erişimi** | **Hayır** | Uygulama içinde genel web tarayıcısı yoktur. |

### 📌 Beklenen Apple Sonucu:
- **Apple Yaş Derecesi:** **17+** (App Store İnceleme Kılavuzu 1.2 gereğince, kullanıcıların serbest gönderi ve yorum paylaşabildiği topluluk platformlarına Apple otomatik olarak 17+ derecelendirmesi uygular).

---

## 4. Çocuk Güvenliği ve COPPA Politikası

1. **Yaş Kısıtı ve Doğum Yılı Kontrolü:**
   - Kayıt ekranında ve profil kurulumunda kullanıcının doğum yılı (`birthYear`) alınır.
   - 13 yaşından küçük bireylerin kayıt olması sözleşme gereği yasaktır.
2. **Çocuklara Yönelik Reklam ve Takip Yasağı:**
   - Pusena'da üçüncü taraf reklam kütüphaneleri (AdMob, Unity Ads vb.) **bulunmamaktadır**.
   - Çocukların kişisel sağlık verileri toplanmaz ve işlenmez.
3. **Google Play Hedef Kitle (Target Audience) Beyanı:**
   - Hedef Yaş Grubu seçiminde **yalnızca 18 yaş ve üzeri (veya 16-17)** seçilmelidir.
   - "Uygulamanız çocukların ilgisini çekebilir mi?" sorusuna **HAYIR** yanıtı verilmelidir (Pembe tonlar tasarım tercihi olup, maskot veya çocuk oyunu içermemektedir).

---

## 5. Doğrulama Durumu

- [x] IARC form soruları ve cevapları Google Play politikalarına göre sabitlendi.
- [x] Apple 17+ App Store derecelendirmesi UGC kılavuzu ile uyumlu hale getirildi.
- [x] COPPA ve çocuk güvenliği politikası belgelendi.
