# Pusena (Bloom) — Mağaza Geliştirici Hesabı ve Organizasyon Doğrulama Rehberi

Bu rehber, **Pusena** uygulamasının Google Play Console ve Apple App Store Connect mağazalarında başarıyla onaylanabilmesi için zorunlu olan geliştirici hesabı türü, kurumsal kimlik doğrulaması, D-U-N-S gereksinimleri ve yasal sağlık beyanlarını adım adım belgeler.

---

## 1. Geliştirici Hesabı Türü ve Zorunlu Şartlar

### 🔹 Google Play Console — Kurumsal (Organization) Hesap Zorunluluğu
> [!CRITICAL]
> **Önemli Kural:** Google Play'in 2023 yılından itibaren yürürlüğe koyduğu **Health Apps Declaration (Sağlık Uygulamaları Politikası)** gereğince, regl, gebelik, semptom ve partner sağlığı gibi hassas verileri işleyen uygulamaların **Bireysel (Personal)** geliştirici hesapları üzerinden yayınlanmasına izin verilmez. Uygulama mutlaka bir **Kurumsal (Organization) Geliştirici Hesabı** altında yayınlanmalıdır.

#### Kurumsal Hesap Kurulum Gereksinimleri:
1. **D-U-N-S® Numarası:** Dun & Bradstreet tarafından şirketinize atanmış 9 haneli resmi kimlik numarası (ücretsiz olarak dnb.com üzerinden temin edilebilir).
2. **Yasal Şirket Unvanı:** Vergi levhası ve ticaret sicil gazetesindeki tam ticari unvan.
3. **Kurumsal Alan Adı & E-posta:** Şirket alan adıyla biten resmi e-posta (ör. `contact@pusena.com` veya `destek@pusena.com`; gmail.com veya hotmail.com adresleri kurumsal hesap için kabul edilmez).
4. **Resmi Web Sitesi:** Aktif ve Gizlilik Politikası barındıran web sitesi (ör. `https://pusena-api.onrender.com/privacy` ve tanıtım sayfası).
5. **Telefon Doğrulaması:** Şirket adına kayıtlı kurumsal sabit veya mobil hat.

---

### 🔹 Apple Developer Program — Organization Kaydı
Apple App Store'da sağlık ve yaşam tarzı kategorisinde kurumsal güvenilirlik ve "Sign in with Apple", arka plan yetkileri ve tıbbi sorumluluk beyanları için **Organization** hesabı açılmalıdır:
1. **D-U-N-S® Numarası:** Apple Developer kaydı sırasında şirketin tüzel kişiliğini doğrulamak için girilir.
2. **Yetkili İmza Sahibi (Legal Entity Binding Authority):** Şirket kurucusu veya şirket adına yasal sözleşme imzalamaya yetkili yönetici kimliği.
3. **Apple Kimliği (Apple ID):** İki faktörlü kimlik doğrulaması (2FA) açık olan kurumsal Apple ID.

---

## 2. Uygulama Paket Kimlikleri (Identifiers)

Uygulamanın derleme ve mağaza kayıtlarında kullanılan paket kimlikleri aşağıda sabitlenmiştir:

| Platform | Parametre | Değer | Açıklama |
| :--- | :--- | :--- | :--- |
| **Android** | Package Name | `com.pusena.app` | Google Play Store'daki kalıcı ve kurumsal uygulama kimliği |
| **iOS** | Bundle Identifier | `com.pusena.app` | Apple App Store Connect'teki kalıcı App ID |
| **Expo / EAS** | Slug & Project ID | `pusena-app` / `7bc418e6-d281-4c29-b935-84447480d52e` | EAS Cloud derleme kimliği |
| **URL Scheme** | Deep Linking | `pusenaapp` | Google OAuth ve harici yönlendirmeler |

---

## 3. Google Play Konsol Beyanları ve Form Cevapları

### A) Sağlık Uygulamaları Beyanı (Health Apps Declaration)
- **Soru:** Uygulamanız sağlık veya tıbbi hizmetler sunuyor mu veya kullanıcıların sağlık verilerini takip ediyor mu?
  - **Cevap:** **Evet** (Döngü ve gebelik takibi, semptom kaydı).
- **Kategori:** *Menstruation & Fertility Tracking / Pregnancy Tracking*.
- **Tıbbi Cihaz Uygunluğu:** Uygulama bir tıbbi cihaz veya klinik teşhis aracı **değildir**. Genel yaşam tarzı ve kişisel farkındalık amaçlı bilgilendirme sunar (uygulama içinde her ekranda `MedicalDisclaimer` mevcuttur).

### B) Arka Plan Konum Beyanı (Prominent Disclosure & Location Declaration)
- **Kullanım Amacı:** Yalnızca kullanıcı tarafından eşleşilen partner ile anlık mesafe hesaplamak ve karşılıklı konum paylaşmak.
- **Uygulama İçi Bildirim (Prominent Disclosure):** Kullanıcı konum paylaşımını açtığında, sistem izin penceresinden önce özel bir bilgilendirme ekranı (`LocationDisclosureModal`) gösterilerek onay alınır.
- **Graceful Fallback:** Kullanıcı konum iznini reddettiğinde uygulama kesinlikle kilitlenmez veya kapanmaz; regl, gebelik, semptom ve topluluk özellikleri kesintisiz çalışmaya devam eder.
- **Arka Plan Video Kanıtı:** Google Play inceleme ekibine, iki cihazın partner kodu ile eşleştiği ve konum paylaşımının açılıp haritada gösterildiği 30 saniyelik bir kullanım videosu (YouTube linki olarak) sunulur.

### C) Veri Güvenliği (Data Safety Section)
- **Sağlık & Fitness Verileri:** Toplanır (kullanıcı isteğiyle). Şifrelenmiş olarak iletilir (HTTPS/TLS). Kullanıcı dilediğinde uygulama içinden veya web sayfasından (`/delete-account.html`) kalıcı olarak silebilir. Üçüncü taraflara satılmaz.
- **Konum Verileri:** İsteğe bağlıdır, yalnızca partner ile paylaşılır, üçüncü taraflara veya reklam ağlarına verilmez.
- **Kişisel Bilgiler:** E-posta ve şifre (hesap güvenliği ve doğrulama amacıyla toplanır).

---

## 4. Apple App Store Connect Kontrol Listesi

1. **Sign in with Apple (App Store Kılavuzu 4.8):**
   - Google ile giriş sunulduğu için "Apple ile Giriş Yap" butonu iOS ekranlarına eklenmiştir (`login.tsx`).
   - App Store Connect üzerinde *Certificates, Identifiers & Profiles > App IDs > Capabilities* sekmesinde **Sign in with Apple** yetkisi aktifleştirilmelidir.
2. **Tıbbi Sorumluluk Reddi (Guideline 1.4.1):**
   - Doğurganlık rehberi, gebelik ekranı ve semptom takip sayfalarında tıp doktoru tavsiyesi yerine geçmeyeceği net bir şekilde vurgulanmıştır (`MedicalDisclaimer.tsx`).
3. **Hesap Silme Akışı (Guideline 5.1.1(v)):**
   - Kullanıcı profil ayarlarından (`account-settings.tsx`) ve web üzerinden (`/delete-account.html`) tek adımda hesabını ve ilişkili tüm verilerini silebilir.
4. **Gizlilik Politikası URL'i:**
   - App Store Connect alanına `https://pusena-api.onrender.com/privacy` girilecektir.

---

## 5. Doğrulama Durumu

- [x] Kurumsal hesap (Organization) şartları ve D-U-N-S numarası dokümante edildi.
- [x] Bundle Identifier (`com.pusena.app`) ve Android Package Name eşleşti.
- [x] Sign in with Apple capability entegrasyonu tamamlandı.
- [x] Google Play Health Apps ve Background Location Prominent Disclosure gereksinimleri karşılandı.
