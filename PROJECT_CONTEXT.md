# Pusena — Kapsamlı Proje Bağlam Dokümanı

Bu dosya, kod tabanının (2026-08) incelenmesine dayanır. README veya tasarım notlarına (`api_design.md`, `ux_design.md`, `db_design.md`) güvenilmedi; kaynak `nodejs_space/src`, `nodejs_space/prisma/schema.prisma`, `react_native_space/app` ve ilgili config dosyalarıdır.

**Secret, API key, token, şifre veya credential değeri bu dokümanda yoktur.** Seed dosyasındaki demo parolalar da tekrarlanmaz.

Koddan doğrulanamayan her iddia `Belirsiz / koddan kesin tespit edilemedi` olarak işaretlenir.

---

# 1. PROJENİN GENEL TANIMI

## Ad

Ürün adı **Pusena**. Kod ve paketlerde tarihsel isimler de geçer: Bloom, Abacus (`abacusai-mobile-apps`, `com.abacusai.bloomapp.t1787256823`, partner kod prefix `BL-` / `BLOOM-` / `PUSENA-`). Swagger başlığı: `Pusena API`. Mobil `app.json` `name`: `Pusena`.

Repo kökü: `bloom_app` (monorepo).

## Amaç

Kadın sağlığı + ilişki/partner desteği mobil uygulaması. Kullanıcı döngü (regl), gebelik ve ilişki modüllerini seçer; semptom, takvim, topluluk, asistan ve partner eşleşmesi aynı hesap üzerinden yürür. Erkek hesaplar bilinçli olarak yalnızca ilişki/partner tarafına indirgenir.

## Çözdüğü problem

- Regl/döngü kaydı ve tahmini doğurgan pencere
- Gebelik haftası takibi ve içerik
- Partnerin (özellikle erkek kullanıcının) eşinin döngü/gebelik özetini görmesi
- Çift sohbeti, konum paylaşımı, özel günler
- Topluluk ve sağlık içeriği
- Yerel cihaz alarmları + sunucu bildirim kutusu

## Hedef kullanıcılar

- Kadın / other: period ve/veya pregnancy + isteğe bağlı relationship
- Erkek: yalnızca relationship (backend `filterModulesForGender` bunu zorlar)
- Admin: `User.isAdmin === true` — uygulama içi admin paneli ve `/admin-portal` HTML

## Ana kullanım senaryoları

1. Kayıt → cinsiyet/modül seçimi → (period veya pregnancy setup) → ana ekran
2. Döngü takvimi, regl başlat/bitir, semptom kaydı
3. Gebelik haftası okuma, due date, (cihaz-içi) tekme/kasılma/kilo araçları
4. Partner kodu ile eşleşme → sohbet, nudge, konum, partner rehberi
5. Topluluk gönderi/yorum/takip
6. AI asistan (Groq, Nest `/api/assistant/chat`)
7. Admin içerik ve kullanıcı yönetimi

## Mevcut temel özellikler (kodda canlı)

Sunucu destekli: auth (JWT + refresh), settings/modüller, period, fertility skoru, pregnancy + week content (DB), symptoms, relationship/pair/live, special dates, community, notifications, dashboard/insights, articles/FAQ/myths (bellek içi), assistant, media blob, admin.

Cihaz/local: ilaç listesi, mood journal, kegel, kick/contraction/weight/feeding timer, hospital bag, aşı checklist, BBT grafiği, adım sayacı, bir kısım rehber metinleri.

Sahte/placeholder: `profile/premium.tsx` (ödeme yok), `sleep-sounds.tsx` ve `meditation-player.tsx` (ses oynatma yok), `forgot-password` (e-posta göndermez).

## Genel çalışma mantığı

İki süreç:

1. **NestJS API** (`nodejs_space`) — Render’da `https://pusena-api.onrender.com`, PostgreSQL (Supabase).
2. **Expo / React Native** (`react_native_space`) — EAS ile APK; release build’de API adresi `app.json extra.productionApiUrl` olarak gömülür.

Mobil istemci JWT access token (15 dk) + refresh token (DB, 30 gün) kullanır. İş mantığının çoğu sunucudadır; bazı wellness araçları yalnızca AsyncStorage’dadır.

---

# 2. TEKNOLOJİ STACK'İ

## Frontend (`react_native_space`)

| Teknoloji | Amaç |
|-----------|------|
| TypeScript | Dil |
| Expo SDK ~54, React Native 0.81, React 19.1 | Mobil runtime |
| Expo Router 6 | Dosya tabanlı routing (`app/`) |
| React Query (`@tanstack/react-query`) | Server state; Orval hook’ları |
| Orval 8.12 | `nodejs_space/swagger.json` → `src/api/generated/` |
| AsyncStorage | Token, tema, local araç verisi |
| expo-auth-session + expo-web-browser | Google OAuth tarayıcı oturumu |
| expo-notifications | Yerel alarmlar (`bloomAlerts.ts`) |
| expo-location | Partner konum paylaşımı |
| expo-sensors (Pedometer) | Adım |
| expo-image-picker | Anı/avatar fotoğrafı |
| react-native-paper | Kısmi UI |
| date-fns | Tarih |
| EAS Build | Android APK (`preview`) / AAB (`production`) |

**Kullanılmayan / zayıf:** `expo-secure-store` bağımlılıkta var, token AsyncStorage’da. `axios` bağımlılıkta var, asıl katman `customFetch` (fetch). `expo-av` sleep/meditation’da fiilen kullanılmıyor.

## Backend (`nodejs_space`)

| Teknoloji | Amaç |
|-----------|------|
| NestJS 11 | HTTP API, modül/controller/service |
| TypeScript 5.6 | Dil |
| Prisma 6.7 + `@prisma/client` | ORM, PostgreSQL |
| Passport JWT + `@nestjs/jwt` | Access token |
| bcryptjs | Şifre hash (cost 10) |
| class-validator / class-transformer | DTO, global ValidationPipe |
| `@nestjs/throttler` | 60 sn / 100 istek, global `ThrottlerGuard` |
| `@nestjs/swagger` | OpenAPI; `/api-docs` (prod’da kapalı) |
| google-auth-library | Google `id_token` doğrulama |
| dotenv | `.env` yükleme (`main.ts` başında) |
| Yarn 4.13 | Paket yöneticisi (`packageManager`) |

## Veritabanı

PostgreSQL (Supabase). Prisma `schema.prisma`. **`prisma/migrations` klasörü yok.** Render build yalnızca `npx prisma generate` çalıştırır, `migrate` çalıştırmaz. Şema değişikliği için `prisma db push` veya migrate’in elle çalıştırıldığı **koddan kesin tespit edilemedi**.

## Authentication

JWT Bearer access (15m, payload `{ sub, email }`) + `RefreshToken` tablosu (UUID, 30 gün, rotation). Cookie/session yok.

## State management

- Client: React Context (`AuthContext`, `ThemeContext`, `LanguageContext`)
- Server: React Query
- Cihaz: AsyncStorage
- Global Redux/Zustand **yok**

## Styling

`src/theme/colors.ts` + `StyleSheet`. Cinsiyete göre palet (`female` pembe/mor, `male` teal). Dark/light `userInterfaceStyle: automatic`.

## Cache / Queue / Realtime / Search / Analytics / Monitoring

- Redis/cache katmanı **yok**
- Queue (Bull, SQS) **yok**
- WebSocket **yok**; çift sohbet HTTP polling
- Arama: community user search ve articles filter, DB/in-memory; Elasticsearch **yok**
- Analytics SDK **yok** (kodda)
- Monitoring: Render health `/health`; APM **yok**
- Media cache header: `Cache-Control: private, max-age=86400`

## Storage

Fotoğraflar `MediaObject.bytes` (BYTEA) Postgres’te. S3/Supabase Storage bucket kullanımı **aktif API yolunda yok**. `EXPO_PUBLIC_SUPABASE_URL` mobil `.env.example`’da var; asistan edge kapalı.

## Testing

Backend: Jest + `supertest`. Yalnızca `app.controller.spec.ts` ve `test/app.e2e-spec.ts` (`GET /`). Frontend: jest-expo bağımlılıkta, **test script ve test dosyası yok**.

## Build / deploy / CI

- Backend: `yarn build` → `dist/`, Render Blueprint `render.yaml` (root), servis `pusena-api`
- Frontend: `eas.json` profiles; `npx eas-cli@latest build -p android --profile preview`
- GitHub Actions / CI workflow **repoda tespit edilmedi**

## Harici servisler

- **Supabase Postgres:** `DATABASE_URL`
- **Groq:** asistan chat (`https://api.groq.com/openai/v1/chat/completions`)
- **Google OAuth:** login (env doluysa)
- **Render:** API hosting
- **Expo EAS:** native build
- **cron-job.org** (operasyonel, repo dışı): ücretsiz instance uyanık tutmak için `/health` ping; Nest cron endpoint’leri ayrı (`x-api-key`)

## Önemli bağımlılıklar (özet)

Backend: `@nestjs/*`, `@prisma/client`, `passport-jwt`, `bcryptjs`, `google-auth-library`, `uuid`.  
Frontend: `expo`, `expo-router`, `@tanstack/react-query`, `@react-native-async-storage/async-storage`.

---

# 3. PROJE DOSYA VE KLASÖR YAPISI

```text
bloom_app/
├── PROJECT_CONTEXT.md          # Bu doküman
├── render.yaml                 # Render Blueprint (rootDir: nodejs_space)
├── grafik/                     # Marka görselleri (icon.png, pusena-logo.png)
├── supabase/                   # Edge function (assistant-chat) — mobil tarafta KAPALI
├── nodejs_space/               # NestJS API
│   ├── prisma/schema.prisma    # Tek şema kaynağı (migrations yok)
│   ├── prisma/seed.ts          # Admin + içerik seed
│   ├── src/main.ts             # Bootstrap, CORS, PORT, swagger
│   ├── src/app.module.ts       # Modül kaydı + ThrottlerGuard
│   ├── src/auth/
│   ├── src/users/
│   ├── src/settings/
│   ├── src/period/             # PeriodService + FertilityService
│   ├── src/pregnancy/
│   ├── src/symptoms/
│   ├── src/relationship/       # pair, couple-live, partner-guide
│   ├── src/special-dates/
│   ├── src/community/
│   ├── src/notifications/      # inbox + cron HTTP
│   ├── src/dashboard/          # dashboard + insights
│   ├── src/articles/           # in-memory içerik
│   ├── src/assistant/          # Groq
│   ├── src/media/              # BYTEA serve
│   ├── src/admin/              # REST + admin-portal HTML
│   ├── src/prisma/
│   ├── src/secrets/hydrate-secrets.ts
│   ├── src/common/             # jwt guard, pair, gender-modules, dates
│   ├── swagger.json            # Orval input
│   └── scripts/safe-seed.ts    # scripts/seed.ts bekler — o dosya yok
├── react_native_space/         # Expo uygulama
│   ├── app/                    # Expo Router ekranları
│   ├── src/api/                # customFetch, generated, bloomClient, apiBase
│   ├── src/contexts/           # Auth, Theme, Language
│   ├── src/theme/
│   ├── src/utils/              # onboarding, gender, pairFlow, mediaUrl
│   ├── src/notifications/      # bloomAlerts (yerel)
│   ├── src/data/               # statik kataloglar
│   ├── app.json / app.config.js / eas.json
│   └── orval.config.ts
├── api_design.md, ux_design.md, db_design.md  # Eski tasarım notları; kodla sapmış olabilir
└── .abacusai/                  # Yerel credential — gitignore; dokümana değer yazılmaz
```

**Önemli klasör sorumlulukları**

- `nodejs_space/src/<feature>/`: Nest feature modülü (controller + service + dto)
- `nodejs_space/src/common/`: paylaşılan guard ve domain helper
- `react_native_space/app/`: ekranlar; `tabs/` ana navigasyon
- `react_native_space/src/api/generated/`: **elle düzenleme**; `orval` ezer
- `react_native_space/src/api/bloomClient.ts`: swagger’a henüz düşmemiş/elle eklenen hook’lar

---

# 4. MİMARİ

**Monolith HTTP API + mobil client.** Microservice, worker process, message queue yok.

```text
Kullanıcı (Android/iOS)
  → Expo app (AuthContext, React Query)
    → HTTPS customFetch + Bearer
      → NestJS (Throttler → JwtAuthGuard? → ValidationPipe → Controller → Service → Prisma)
        → PostgreSQL (Supabase)
        → Groq (yalnızca assistant)
        → Google token endpoint (yalnızca OAuth callback)
      ← JSON
    ← UI / AsyncStorage / yerel bildirim
```

Cron: harici HTTP POST → `NotificationsController` cron route → `NotificationsService` → `Notification` satırları. Uygulama içi “push” bu satırların mobil inbox + yerel `expo-notifications` ile birleşimidir; FCM/APNs uzak push **stub** (`expoPushStub.ts`).

**Pattern:** Nest **layered monolith** (Controller → Service → PrismaClient). Repository sınıfı yok. DTO + Swagger. Feature-module sınırları var; cross-module çağrı inject ile (Admin → ArticlesService).

Frontend: Expo Router file-based + Context + React Query. MVC değil.

---

# 5. FRONTEND MİMARİSİ

## Routing

Expo Router. Kök `app/_layout.tsx` Stack (`headerShown: false`).

Giriş kapısı `app/index.tsx`:

1. loading → `LoadingScreen`
2. unauthenticated → `/auth/login`
3. `user.isAdmin` → `/admin`
4. `!hasCompletedSetup` → `/setup`
5. aksi → `/tabs/home`

Aynı kural `app/tabs/_layout.tsx` ve `src/utils/routing.ts` `getPostAuthRoute`.

**Görünür tablar:** home, articles, community, story (Partner), profile.  
**Gizli tab (`href: null`):** `messages` (asistan), `tracking`.

## Layout / provider sırası (`app/_layout.tsx`)

`ErrorBoundary` → `QueryClientProvider` → `ThemeProvider` → `LanguageProvider` → `ApiBaseGate` (`loadApiBase`) → `AuthProvider` → Stack + `GenderThemeSync`.

Bildirim provider’ı yok; `useBloomAlertSync` tab layout’ta.

## Auth state

`AuthContext`: `user`, `isAuthenticated`, `login`/`signup`/`logout`/`refreshUser`/`setAuthFromCallback`. Token keys: `auth_token`, `refresh_token` (AsyncStorage).

## API

- Tüm generated hook’lar `customFetch` mutator
- 401 → `POST /api/auth/refresh` (refresh path’leri hariç) → retry; başarısızsa token sil
- Base URL: `getApiBase()` — release’te `https://pusena-api.onrender.com`; dev’de `EXPO_PUBLIC_API_URL` veya override `app/auth/server.tsx` (`__DEV__`)

## Form / validation

Ekran içi kontrollü state + `Alert`. Paylaşılan form library (Formik/RHF) **yok**. Backend `ValidationPipe` asıl doğrulayıcı.

## Error / loading

- Query retry: 401/404’te yok, diğerinde 1 kez
- Ekranlar try/catch + `Alert.alert` veya inline hata metni
- Asistan chat hata metni: “Şu anda yanıt üretemedim…” (`app/tabs/messages.tsx`)

## Styling / responsive

Sabit `StyleSheet`; telefon portrait (`orientation: portrait`). Tablet iOS `supportsTablet: true` ama ayrı layout **yok**.

## i18n

`LanguageContext` + `src/i18n/translations.ts` (`tr`/`en`). Kullanım dar: register ve language ekranı. Çoğu UI **hardcoded Türkçe**. Sunucu `User.language` PATCH `/api/users/language`.

## Önemli kullanıcı akışları

Kayıt → setup/index (modül+cinsiyet) → period veya pregnancy setup → `finishOnboarding` → home.  
Partner: `/tabs/story` → kod → `pairFlow.confirmPartnerPair` → `/api/relationship/pair`.  
Asistan: profile/messages → `/api/assistant/*` (Supabase edge **kullanılmaz**).

---

# 6. BACKEND MİMARİSİ

## Başlangıç (`src/main.ts`)

1. `dotenv` `loadEnv()`
2. `hydrateSecretsFromSupabase()` — `AppSecret` UPSERT + env hydrate; `MediaObject` tablo ensure
3. `NestFactory.create`
4. static `public/`
5. JSON/urlencoded limit **12mb**
6. CORS (`CORS_ORIGINS` veya `origin: true`)
7. `ValidationPipe({ whitelist, transform, forbidNonWhitelisted })`
8. Swagger koşullu
9. `listen(PORT || 3000, '0.0.0.0')`

## Katmanlar

```text
Controller (HTTP + Guard + DTO)
  → Service (iş kuralı)
    → PrismaService (PrismaClient)
```

Repository yok. Prisma doğrudan service’te.

## Middleware / guards

- Global: `ThrottlerGuard`
- Route: `JwtAuthGuard` (Passport JWT)
- Admin: handler içinde `AdminService.assertAdmin(userId)` (DB `isAdmin`)
- Cron: `x-api-key` === `CRON_SECRET || JWT_SECRET`

## Validation

class-validator DTO. `forbidNonWhitelisted: true` — extra field 400.

## Error handling

Nest default exception filter. Türkçe `UnauthorizedException` / `ForbiddenException` / `NotFoundException` mesajları servislerde. Özel global filter **yok**.

## Logging

`Logger` (assistant Groq hataları). Merkezi log stack yok.

## File handling

Data URI → `MediaService.persistDataUri` → BYTEA. GET `/api/media/:id` **auth yok**.

## Background

Process içi worker yok. Cron HTTP ile tetiklenir.

## External

Groq `fetch`; Google OAuth token + `verifyIdToken`.

---

# 7. API ENVANTERİ

Auth: çoğu JWT. Aşağıda işleyiş için kritik olanlar.

## Health / kök

**GET `/health`**  
Amaç: uptime. Auth yok. DB yok. `AppController.getHealth`. Render healthCheckPath.

**GET `/`**  
Hello World. `AppService`.

## Auth

**POST `/api/signup`**  
Auth: yok. Body: `SignupDto`. `AuthService.signup` → User + UserSettings + tokens. Erkek: `activeModules: ['relationship']`.

**POST `/api/auth/login`**  
Identifier email/nickname/name. Alias `"admin"` özel eşleme (kodda). Google-only hesapta şifre yoksa fail.

**GET `/api/auth/me`** JWT. User + settings. Eksik partnerCode üretir.

**POST `/api/auth/refresh`** Body refreshToken. Rotation.

**POST `/api/auth/logout`** JWT + refreshToken sil.

**POST `/api/auth/forgot-password`** Enumeration korumalı stub; mail yok.

**PATCH `/api/auth/change-password`** JWT.

**DELETE `/api/auth/account`** JWT; `DeletedAccount` + cascade User.

**GET `/api/auth/google`**, **GET `/api/auth/google/callback`**  
`GOOGLE_CLIENT_*` ve `APP_ORIGIN` gerekir. `getOrThrow` — env yoksa exception.

## Users / settings

**PATCH `/api/users/profile`**, **PATCH `/api/users/language`**  
**GET/POST `/api/users/assessment`** — `FertilityAssessment`  
**CRUD `/api/users/memories`** — `CoupleMemory`  
**GET `/api/users/doctor-summary`** — sağlık özeti  
**GET `/api/users/:userId/public`** — JWT var; public profil

**GET `/api/settings`**, **PATCH `/api/settings/modules|notifications|privacy`**, **PATCH `/api/settings/complete-setup`**  
Modüller erkekte `filterModulesForGender` ile ezilir.

## Period / pregnancy / symptoms

**POST `/api/period/setup`**, **GET `/api/period`**, **POST `/api/period/log|start|end`**, **GET `/api/period/calendar|history`**, **GET `/api/period/fertility`**, **PATCH `/api/period/cycles/:id/end`**

**POST/PUT/GET/DELETE `/api/pregnancy`**, **GET `/api/pregnancy/weeks/:weekNumber`**, **GET `/api/pregnancy/baby-names`**, **POST `/api/pregnancy/baby-name`**, **POST `/api/pregnancy/postpartum/reminders`**

**POST/GET `/api/symptoms`**, **GET `/api/symptoms/types|history`**, **DELETE `/api/symptoms/:id`**

## Relationship / dates

**POST `/api/relationship/lookup|pair|unpair`**, CRUD relationship  
**GET `/api/relationship/partner-info|partner-guide|couple-questions`**  
**GET/POST `/api/relationship/live/location|nudges|messages`**

**CRUD `/api/special-dates`**

## Community / notifications / dashboard

**`/api/community/*`** JWT: posts, comments, like, save, follow, block, report, user search.

**`/api/notifications`** JWT inbox; **POST `/api/notifications/cron/*`** API key.

**GET `/api/dashboard`**, **GET `/api/dashboard/insights`**

## Articles / assistant / media

**GET `/api/articles`, `/faqs`, `/myths`, `/:id`** — **public**, JWT yok. Kaynak: in-memory array.

**GET `/api/assistant/daily-insight`**, **POST `/api/assistant/chat`** — JWT. Groq; fail → fallback metin.

**GET `/api/media/:id`** — public binary.

## Admin

**GET `/admin-portal`** — HTML, guard yok (client JWT).  
**`/api/admin/*`** — JwtAuthGuard + `assertAdmin`. Kullanıcı, içerik, post/comment, broadcast bildirim, deleted-accounts.

---

# 8. VERİTABANI VE VERİ MODELİ

Kaynak: `nodejs_space/prisma/schema.prisma`. PK’ler UUID string. Soft delete **yok** (hesap silme hard delete + `DeletedAccount` audit).

## User

Alanlar: email unique, password nullable (Google), name, nickname, biography, avatarUrl, partnerCode unique, pairedUserId (FK yok, düz string), googleId unique, hasCompletedSetup, isAdmin, gender (`female|male|other` string), language default `tr`, birthYear, heightCm, weightKg, timestamps.

İlişkiler: 1-1 settings, pregnancy, relationship, assessment, partnerLocation; 1-n cycles, symptoms, posts, notifications, refreshTokens, mediaObjects, …

## UserSettings

`activeModules` string[]; bildirim boolean’ları; `reminderOffsets` int[] default `[30,7,3,1]`; gizlilik: profilePublic, showCommunityPosts, allowFollow.

## PeriodCycle / PeriodDay / Symptom / SymptomType

Cycle: startDate, endDate?, cycleLength, periodLength.  
PeriodDay: unique (userId, date), flowLevel.  
Symptom: type string, severity int, date.  
SymptomType: seed kataloğu.

## Pregnancy / PregnancyWeekContent / BabyName

Pregnancy 1-1 user: LMP, dueDate, babyName, isActive.  
Week content: weekNumber unique, metin alanları + arrays. DB.  
BabyName: name unique, gender girl/boy/unisex.

## Relationship / SpecialDate

Relationship 1-1: partnerName, startDate.  
SpecialDate: relationshipId FK, isRecurring, reminderDays + reminderDaysList.

## Community

CommunityPost, PostLike unique(user,post), SavedPost, Comment, Report unique(reporter,post), BlockedUser unique, Follow unique(follower,following).

## Partner live

PartnerLocation 1-1: lat/lng, sharingEnabled.  
PartnerNudge: type, status default `open`.  
CoupleMessage: pairKey, kind default `chat`, optional nudgeId.

## Other

Notification: type/module string, actionType/actionPayload, actionDone.  
RefreshToken: token unique, expiresAt.  
CoupleMemory, CoupleQuestionAnswer unique(user,questionId).  
FertilityAssessment 1-1, answers Json.  
MediaObject: kind, mimeType, bytes.  
AppSecret: key PK, value (sunucu vault).  
DeletedAccount: email, name, reason.

## ER özeti

```text
User
├── 1-1 UserSettings, Pregnancy, Relationship, FertilityAssessment, PartnerLocation
├── 1-n PeriodCycle → PeriodDay
├── 1-n Symptom, SpecialDate, CommunityPost, Notification, RefreshToken, MediaObject
├── pairedUserId → User (uygulama katmanı; Prisma relation yok)
└── Follow / Block / Like / Save (junction)

Relationship 1-n SpecialDate
CommunityPost 1-n Comment, PostLike, SavedPost, Report
```

## Migration

Klasör yok. Seed: `prisma/seed.ts` (admin kullanıcılar, symptom types, week content, baby names — dosyanın devamı). `npx prisma db seed`.

---

# 9. AUTHENTICATION VE AUTHORIZATION

## Login akışı

1. Mobil `AuthContext.login` → `POST /api/auth/login` `{ email, password }` (identifier aslında email/nick/name)
2. `AuthService.login` kullanıcıyı bulur, bcrypt compare
3. `generateTokens`: JWT `{ sub: id, email }` 15m; refresh UUID DB 30g
4. Client AsyncStorage’a yazar, `user` state
5. Sonraki istekler `Authorization: Bearer <access>`
6. 401 → refresh → yeni çift; fail → logout

## Register

`POST /api/signup` → hash, partnerCode `BL-xxxxxx`, settings, tokens. Setup henüz tamam değil (`hasCompletedSetup` default false).

## Google

Mobil WebBrowser `GET {api}/api/auth/google?redirect_uri=...` → Google → callback → redirect_uri query `token`, `refreshToken`, `user` → `setAuthFromCallback`.  
`APP_ORIGIN` callback URL üretiminde kullanılır (default `http://localhost:3000/`). Render’da set edilmezse Google callback yanlış origin’e gider.

## Roles

İki seviye: normal user, `isAdmin`. JWT’de rol yok; admin her seferinde DB. Permission matrix yok.

## Protected routes

- Backend: `JwtAuthGuard` class veya method
- Frontend: index/tabs/admin/setup layout redirect
- Articles ve media ve health public

## Password

bcrypt 10. Google kullanıcısı password null.

---

# 10. TEMEL BUSINESS LOGIC

### Modül sistemi

Amaç: period / pregnancy / relationship aç-kapa.  
Kullanıcı: setup’ta seçer; erkek UI’da period/pregnancy yok.  
Teknik: `UserSettings.activeModules` + `filterModulesForGender` (erkek her zaman `['relationship']`).  
Dosyalar: `settings.service.ts`, `gender-modules.ts`, `react_native_space/src/utils/gender.ts`, `app/setup/index.tsx`.  
Edge: erkek client period route’una deep link ile gidebilir (stack guard yok) ama API veri dönebilir; ** Belirsiz / ürün olarak istenmeyen erişim**.

### Döngü / regl

Setup LMP + cycleLength + periodLength → `PeriodCycle`. Takvim günleri `PeriodDay`. Start/end endpoint’leri aktif kanama. `common/dates.ts` timezone-safe `localDateKey`. Fertility: son döngüler + assessment + BMI + semptom → Wilcox penceresi (`fertility.service.ts`).

### Gebelik

LMP → dueDate hesap (servis). Hafta içeriği `PregnancyWeekContent`. Silme `isActive` veya delete — controller DELETE var. Postpartum reminders `Notification` `postpartum_task`.

### Partner eşleşme

`partnerCode` normalize (`BL-`/`BLOOM-`/`PS-`/`PUSENA-`). Lookup cinsiyet zorunlu, self-pair yok, 409 eğer partner dolu. Pair karşılıklı `pairedUserId` + relationship senkron. `ensureMutualPair` kopuk bağı düzeltir. Partner-guide erkek kullanıcıya partnerin period/pregnancy özetini verir (`partner-guide.service.ts`).

### Çift canlı

Konum POST, GET partner konumu (sharingEnabled). Nudge + chat `CoupleMessage` `pairKey`. Polling. Bildirim type `partner_nudge`, `couple_message`.

### Asistan

`daily-insight` kural tabanlı (gebelik haftası veya döngü günü). `chat` Groq JSON `{text, options}`; key yok veya HTTP fail → `fallbackReply` (yine 200 + metin). Mobil catch yalnızca **ağ/HTTP exception**’da “yanıt üretemedim” gösterir. Eski yol: Supabase `assistant-chat` — `isAssistantEdgeConfigured() === false`.

### Topluluk

Post category, like count denormalize, follow, block, report. Bildirim like/comment/follow.

### Dashboard / insights

Home kartları: aktif modüle göre period strip, gebelik progress, ilişki gün sayacı. Insights: max 12 kart, cinsiyet+modül.

### Bildirimler

Sunucu kutusu + cron üretim + yerel expo alarm (`bloomAlerts`, ilaç/countdown). `period_confirm` action → kullanıcı “yes” ile yeni cycle.

### Admin içerik

Week/symptom/babyName **DB**. Article/FAQ/myth **process memory** — restart siler.

---

# 11. ÖNEMLİ USER FLOW'LAR

### Kayıt → home

`register.tsx` → `authControllerSignup` → `AuthContext` → `index` → `/setup` → `settingsControllerUpdateModules` → period/pregnancy/relationship setup API → `finishOnboarding` (`settingsControllerCompleteSetup`) → `/tabs/home` → `GET /api/dashboard`.

### Login

`login.tsx` → login API → tokens → `getPostAuthRoute`.

### Regl günü

`period/index.tsx` → calendar GET → start/end POST → dashboard invalidation (React Query keys — generated hook).

### Partner pair

`story/couple-profile.tsx` / setup/relationship → `confirmPartnerPair` → lookup POST → pair POST → her iki user `pairedUserId`.

### Asistan

`messages.tsx` GET daily-insight; POST chat `{ question, history }` → `AssistantService.respondToUser`.

### Admin

`user.isAdmin` → `/admin` → `adminClient` / generated admin hooks → `assertAdmin`.

---

# 12. STATE VE DATA FLOW

```text
Postgres → Prisma → Nest JSON
  → customFetch → React Query cache ve/veya AuthContext.user
    → ekran
Local: AsyncStorage (token, tema, ilaç, kick counter…)
Realtime yok; chat GET polling (aralık ekran kodunda)
Optimistic update: yaygın değil (Belirsiz / çoğu ekran await + refresh)
```

`active_home_module` AsyncStorage home sekmesi için; sunucu `activeModules` kaynak of truth.

---

# 13. HARİCİ ENTEGRASYONLAR

### Groq

Amaç: asistan yanıtı.  
Dosya: `assistant.service.ts`.  
Bağlantı: Bearer `GROQ_API_KEY`, model `GROQ_MODEL` veya default `openai/gpt-oss-20b`.  
Webhook yok. Fail: log + null → fallback metin. Retry yok.

### Google OAuth

`auth.service.ts` getGoogleAuthUrl / handleGoogleCallback. Fail: redirect `error=auth_failed`.

### Supabase

Postgres host. `AppSecret` vault. Edge `supabase/functions/assistant-chat` **mobilde kapalı**. Webhook yok.

### Expo notifications

Yerel zamanlama. Remote push stub.

### Render / EAS / cron-job.org

Altyapı; uygulama kodu değil. Health ping keep-alive.

---

# 14. BACKGROUND JOB / CRON / QUEUE / WEBHOOK

Queue/webhook yok.

```text
Harici scheduler
  → POST /api/notifications/cron/pregnancy-tips | special-date-reminders | period-reminders
    Header x-api-key
      → NotificationsService
        → Notification insert (dedup kuralları serviste)
```

Repo içinde bu POST’ları çağıran Render cron servisi **yok**. Operasyonel olarak ayrıca kurulmalı.

Keep-alive: GET `/health` (DB’siz).

---

# 15. CONFIGURATION VE ENVIRONMENT

Değer yazılmaz.

### Backend (`.env.example` + kod)

| İsim | Amaç |
|------|------|
| `DATABASE_URL` | Postgres |
| `JWT_SECRET` | Access JWT + OAuth state HMAC; cron fallback |
| `GROQ_API_KEY` / `GROQ_MODEL` | Asistan |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth (`getOrThrow`) |
| `CRON_SECRET` | Cron header; yoksa JWT_SECRET |
| `PUBLIC_API_URL` | Media public URL prefix |
| `CORS_ORIGINS` | CORS allowlist |
| `NODE_ENV` | production’da swagger default off |
| `ENABLE_SWAGGER` | docs |
| `PORT` | Listen (Render) |
| `APP_ORIGIN` | Google callback base (default localhost) — **.env.example’da yok** |

Vault keys hydrate: JWT, GROQ_*, GOOGLE_*, CRON_SECRET, PUBLIC_API_URL.

### Frontend

| İsim | Amaç |
|------|------|
| `EXPO_PUBLIC_API_URL` | Dev API |
| `EXPO_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Edge (şu an asistan kapalı) |
| `EXPO_PUBLIC_AUTH_TOKEN_KEY` | Token storage key override |
| `APP_ENV` | EAS `preview`/`production` → gömülü productionApiUrl |
| `EAS_PROJECT_ID` | app.config fallback |

`app.json extra.productionApiUrl`: `https://pusena-api.onrender.com`.  
`extra.eas.projectId`: EAS proje UUID’si (kimlik, secret değil).

Prod APK’ya Groq/JWT **konulmaz**.

---

# 16. TEST YAPISI

Backend: Jest. `app.controller.spec.ts` hello. E2E `GET /`. Auth/period/pair **testsiz**.  
Frontend: test runner bağlı, dosya yok.  
Mock: yok. Test DB: yok. Coverage pratikte anlamsız.

---

# 17. ERROR HANDLING VE LOGGING

API: Nest HTTP exception → JSON `{ statusCode, message }`.  
Frontend: `ApiError` + `getErrorMessage`. Alert veya inline.  
Logging: Nest Logger. Groq HTTP status loglanır.  
Monitoring: Render log. Sentry **yok**.  
Fallback: asistan Groq fail → kural tabanlı metin. Forgot-password → sahte başarı.

---

# 18. SECURITY ANALİZİ

Kanıt seviyesi belirtilir.

| Konu | Durum |
|------|--------|
| Auth | JWT 15m + refresh rotation. Token AsyncStorage (cihaz compromise riski). `expo-secure-store` kullanılmıyor. **Kanıt: kod.** |
| Admin | DB isAdmin, her istek. JWT’ye rol gömülmez. **Kanıt.** |
| Validation | whitelist + forbidNonWhitelisted. **Kanıt.** |
| SQL injection | Prisma parametreli. Raw SQL hydrate/media ensure sabit string. **Düşük risk kanıtı: parametreli `$executeRaw` secret insert.** |
| XSS | Mobil RN. Admin portal HTML template string concat — admin-only, yine de XSS yüzeyi. **Olası, medium kanıt.** |
| CSRF | Bearer header; cookie yok → klasik CSRF düşük. |
| CORS | Env yoksa `origin: true`. |
| Rate limit | 100/60s global; login’e özel daha sıkı limit **yok**. |
| Secret management | `.env` gitignore; AppSecret tablo; hydrate. Seed’de demo admin parolası **kaynak kodda düz metin** (`prisma/seed.ts`) — **HIGH credential-in-repo**. Bu dokümana kopyalanmadı. |
| File upload | Data URI, 2.5MB, mime jpeg/png/webp. |
| IDOR | `GET /api/media/:id` auth yok — UUID bilen okur. **Kanıt: media.controller.ts.** Community/user public endpoint’ler gizlilik flag’lerine bakıyor olmalı — detay serviste; tam IDOR taraması **Belirsiz.** |
| Google env placeholder | `YOUR_GOOGLE_*` hydrate `isUsable` false sayılır; login Google `getOrThrow` patlar. |

---

# 19. PERFORMANCE VE SCALABILITY

- Media BYTEA Postgres — büyük fotoğraflar DB’yi şişirir; CDN yok.
- Articles tümü process memory; ölçek tek instance varsayar (Render web 1).
- Community list index: authorId, category, createdAt var.
- Pagination birçok listede `page/limit`; bazı GET’ler (symptoms history) limit belirsiz.
- Groq senkron request, chat’i bloklar; queue yok.
- Couple chat polling — N istek.
- N+1: dashboard birden fazla prisma çağrısı; dataloader yok. **Tipik Nest service, HIGH değil MEDIUM.**
- APK bundle: Skia, chart-kit, büyük generated API.
- Free Render cold start ~50s+ (keep-alive cron ile azaltılır).

---

# 20. TEKNİK BORÇ VE RİSKLER

| Madde | Seviye |
|-------|--------|
| Seed içinde demo admin parolası | CRITICAL (repo sızıntısı) |
| Prisma migrations yok; prod şema drift | HIGH |
| Article/FAQ/myth admin edit process-local | HIGH |
| Media public GET | HIGH/MEDIUM (hassas foto) |
| Google/`APP_ORIGIN` prod uyumsuzluğu | HIGH (OAuth) |
| Asistan APK’da eski edge yolu (düzeltilmiş: Nest) — eski APK kırık | MEDIUM (dağıtım) |
| Token AsyncStorage | MEDIUM |
| i18n yarım | MEDIUM |
| Test yok | HIGH (kalite) |
| Premium/sleep/meditation mock | MEDIUM (ürün vaadi) |
| `safe-seed.ts` → olmayan `scripts/seed.ts` | LOW |
| Dual isim Bloom/Pusena/Abacus | MEDIUM (kafa karışıklığı) |
| `package-lock.json` vs yarn (EAS doctor) | MEDIUM — yarn asıl |
| Orval generated vs bloomClient drift | MEDIUM |
| Period/pregnancy stack guard yok | LOW/MEDIUM |
| Forgot-password stub | MEDIUM (kullanıcı beklentisi) |
| Throttler Groq/health aynı kovada | LOW |

TODO/FIXME yorumu yok.

---

# 21. DEĞİŞİKLİK ETKİ HARİTASI

**Auth değişirse:** `auth.service.ts`, `jwt.strategy.ts`, `customFetch.ts`, `AuthContext.tsx`, `app/index.tsx`, `tabs/_layout`, Google login, admin portal JWT, refresh tablo.

**User/gender/modül:** `gender-modules.ts` + `src/utils/gender.ts` **çift bakım**, `settings.service`, setup, home, profile, dashboard, insights, articles filter.

**Period:** `period.service`, `fertility.service`, `dates.ts`, dashboard, insights, cron period-reminders, bloomAlerts, setup/period, `period/*` ekranlar, partner-guide.

**Pregnancy:** pregnancy.service, PregnancyWeekContent seed/admin, dashboard, cron pregnancy-tips, setup/pregnancy, `pregnancy/*`, partner-guide.

**Pair/relationship:** `pair.ts`, relationship.service, couple-live, partner-guide, special-dates (relationshipId), notifications types, `story/*`, User.pairedUserId.

**Asistan:** assistant.service, messages.tsx, GROQ env, (kullanma) assistantEdge.ts / supabase function.

**Media:** media.service, PUBLIC_API_URL, users/community persistDataUri, mediaUrl.ts.

**API kontrat:** swagger.json → `yarn` orval (frontend script **Belirsiz; orval.config var**, package.json script adı kontrol et) → generated/* + bloomClient.

**Deploy:** render.yaml build/start, app.json productionApiUrl, EAS profile env APP_ENV.

---

# 22. GELİŞTİRME REHBERİ

Kodda doğrulanan komutlar:

**Backend** (`nodejs_space`):

```bash
yarn install
npx prisma generate
# şema uygulamak: npx prisma db push   # migrations klasörü olmadığı için
npx prisma db seed
yarn start:dev          # nest watch
yarn build && yarn start:prod
yarn test
yarn test:e2e
```

**Frontend** (`react_native_space`):

```bash
yarn install
yarn start              # expo start
# Android/iOS: yarn android / yarn ios
npx eas-cli@latest build -p android --profile preview
```

Orval: `orval.config.ts` mevcut; `package.json` script adı bu incelemede **açık bir `"orval"` script olarak doğrulanmadı** — `npx orval` muhtemel.

Env: `nodejs_space/.env.example`, `react_native_space/.env.example` kopyala, değerleri panellerden doldur (bu dokümana yazma).

---

# 23. ÖNEMLİ DOSYALAR REFERANSI

| Dosya | Görevi | Neden önemli |
|-------|--------|--------------|
| `nodejs_space/src/main.ts` | Bootstrap | PORT, CORS, hydrate sırası |
| `nodejs_space/src/app.module.ts` | Modül grafiği | Yeni feature buraya |
| `nodejs_space/prisma/schema.prisma` | Veri modeli | Tek şema |
| `nodejs_space/src/auth/auth.service.ts` | Login/signup/token/Google | Kimlik |
| `nodejs_space/src/common/guards/jwt-auth.guard.ts` | JWT | Korumalı route |
| `nodejs_space/src/common/pair.ts` | Eşleşme | Çift domain |
| `nodejs_space/src/common/gender-modules.ts` | Erkek modül kilidi | Backend kaynak |
| `nodejs_space/src/period/period.service.ts` | Döngü | |
| `nodejs_space/src/period/fertility.service.ts` | Doğurganlık skoru | |
| `nodejs_space/src/pregnancy/pregnancy.service.ts` | Gebelik | |
| `nodejs_space/src/relationship/relationship.service.ts` | Pair CRUD | |
| `nodejs_space/src/relationship/couple-live.service.ts` | Chat/nudge/konum | |
| `nodejs_space/src/relationship/partner-guide.service.ts` | Partner özeti | |
| `nodejs_space/src/assistant/assistant.service.ts` | Groq | |
| `nodejs_space/src/notifications/notifications.service.ts` | Inbox+cron | |
| `nodejs_space/src/media/media.service.ts` | Foto BYTEA | |
| `nodejs_space/src/secrets/hydrate-secrets.ts` | Vault | Boot |
| `nodejs_space/src/articles/articles.service.ts` | In-memory CMS | Restart kaybı |
| `render.yaml` | Deploy | |
| `react_native_space/app/_layout.tsx` | Provider | |
| `react_native_space/app/index.tsx` | Redirect | |
| `react_native_space/src/contexts/AuthContext.tsx` | Oturum | |
| `react_native_space/src/api/customFetch.ts` | Tek HTTP | |
| `react_native_space/src/api/apiBase.ts` | API URL | |
| `react_native_space/app.config.js` | extra.apiUrl | Release gömme |
| `react_native_space/src/utils/onboarding.ts` | complete-setup | |
| `react_native_space/src/utils/gender.ts` | Client kilidi | Backend ile çift |
| `react_native_space/src/notifications/bloomAlerts.ts` | Yerel alarm | |
| `react_native_space/orval.config.ts` | Codegen | |

---

# 24. ÖNEMLİ FUNCTION / CLASS / SERVICE REFERANSI

**hydrateSecretsFromSupabase**  
Dosya: `nodejs_space/src/secrets/hydrate-secrets.ts`  
Görev: AppSecret + MediaObject ensure, env UPSERT/hydrate.  
Kim: `main.ts` bootstrap.  
DB: raw SQL + AppSecret.

**AuthService.generateTokens / login / signup**  
`auth.service.ts`. JWT+refresh. Çağıran: AuthController.

**JwtStrategy.validate**  
`{ id: sub, email }` → `req.user`.

**filterModulesForGender**  
Backend `gender-modules.ts`, frontend `gender.ts` — **iki kopya**.

**ensureMutualPair / findUserByPartnerCode**  
`pair.ts`. Relationship + live servisler.

**PeriodService / FertilityService**  
Döngü CRUD vs istatistik.

**AssistantService.askGroq / respondToUser**  
Groq veya fallback. AssistantController.

**NotificationsService.sendPeriodReminders** vb.  
Cron. `period_confirm` action.

**MediaService.persistDataUri / getObject**  
Users/community. GET public.

**finishOnboarding**  
`react_native_space/src/utils/onboarding.ts` → complete-setup + refreshUser.

**customFetch**  
Tüm generated API. 401 refresh.

**loadApiBase / getApiBase**  
İlk istekten önce.

---

# 25. DOMAIN SÖZLÜĞÜ

| Terim | Anlam |
|-------|--------|
| **Pusena** | Ürün adı |
| **Bloom / Abacus** | Eski kod adı, bundle id, bazı prefix’ler |
| **activeModules** | `period`, `pregnancy`, `relationship` |
| **hasCompletedSetup** | Onboarding bitti; home’a geçiş |
| **partnerCode** | `BL-XXXXXX` eşleşme kodu |
| **pairedUserId** | Karşı kullanıcı id (Prisma FK değil) |
| **pairKey** | Çift mesajlarını gruplayan anahtar |
| **nudge** | Partner’a istek (PartnerNudge) |
| **LMP** | Last menstrual period; gebelik hesabı |
| **cycleDay** | Son cycle start’tan gün |
| **fertile window** | Wilcox tabanlı tahmini pencere |
| **period_confirm** | Bildirim aksiyonu; evet → cycle start |
| **AppSecret** | Sunucu vault tablosu, REST yok |
| **MediaObject** | Fotoğraf blob |
| **paletteKind** | `female` / `male` tema |
| **preview profile** | EAS APK, `APP_ENV=preview` |
| **admin-portal** | Nest’in servis ettiği HTML admin |

Gender string: `female`, `male`, `other`. BabyName gender: `girl`, `boy`, `unisex`.

---

# 26. BİLİNEN / MUHTEMEL PROBLEMLER

**Problem:** Asistan APK’da “yanıt üretemedim”  
**Kanıt:** EAS preview env `EXPO_PUBLIC_SUPABASE_*` + eski `isAssistantEdgeConfigured()` true iken edge 404. Düzeltme: Nest-only chat. **Eski APK hâlâ bozuk.**  
**Dosya:** `messages.tsx`, `assistantEdge.ts`.

**Problem:** Makale admin kaydı restart’ta gider  
**Kanıt:** `articles.service.ts` `this.articles[idx] =`.  
**Çözüm:** DB tablo veya CMS.

**Problem:** Media UUID sızıntısı  
**Kanıt:** guard yok.  
**Çözüm:** imzalı URL veya auth.

**Problem:** Google login prod  
**Kanıt:** `getOrThrow` + `APP_ORIGIN` default localhost.  
**Tahmin değil.**

**Problem:** Şifre sıfırlama çalışmaz  
**Kanıt:** stub mesaj.

**Problem:** prisma migrate yok  
**Kanıt:** migrations klasörü yok; Render `prisma generate` only.

**Muhtemel:** Erkek deep link `/period` — stack guard yok. **Tam ürün etkisi Belirsiz.**

**Muhtemel:** Groq model adı sağlayıcıda kalkarsa fallback metin (200), “üretemedim” değil. Kullanıcı şikayeti edge/HTTP kaynaklıydı.

---

# 27. PROJENİN MEVCUT DURUMU

**Tamamlanmış (sunucu+UI bağlı):** auth (email), setup, period, pregnancy week, symptoms, pair, live chat/location/nudge, special dates, community, dashboard, insights, notifications inbox, admin users/posts, local alarms, asistan Nest yolu, Render deploy, ikon `grafik/icon.png`.

**Yarım:** i18n, Google OAuth env, cron scheduler repo içi, remote push, forgot-password, article CMS kalıcılığı.

**Placeholder:** premium, sleep sounds, meditation player, love-notes (local şablon).

**Dead / kapalı:** `assistantEdge` her zaman false; supabase function bakımı isteğe bağlı.

**Deprecated isim:** Bloom, abacus slug — hâlâ bundle/EAS proje adı.

---

# 28. CHATGPT İÇİN MİMARİ KURALLAR

Yeni API özelliği:

1. `nodejs_space/src/<feature>/` module + controller + service + dto  
2. `app.module.ts` imports  
3. JWT gerekiyorsa `@UseGuards(JwtAuthGuard)`  
4. Prisma model gerekirse `schema.prisma` — **migrate/push’u hatırlat**  
5. Swagger decorator → `swagger.json` güncelle → Orval  
6. Eksik hook: `bloomClient.ts` (generated’e el sürme)

Yeni ekran: `react_native_space/app/...tsx` Expo Router. Paylaşılan UI `src/components`. Cinsiyet kilidi hem `gender.ts` hem backend.

DB erişimi yalnızca service + PrismaService. Controller ince kalsın.

Validation DTO class-validator. Naming: `*Controller`, `*Service`, `*Dto`. Route prefix `api/<resource>`.

Hata: Nest HTTP exceptions, Türkçe mesaj.

Asistan: Groq’u client’a taşıma; secret sunucuda.

Foto: data URI → MediaService; client `mediaUrl.ts`.

Erkek kullanıcılara period/pregnancy API yazmamak için mevcut `filterModulesForGender` desenini bozma.

---

# 29. CHATGPT PROJECT CONTEXT

## CHATGPT PROJECT CONTEXT

Pusena, Expo 54 mobil istemci + NestJS 11 monolith API + Supabase Postgres uygulamasıdır. Kadın sağlığı (regl, gebelik, semptom) ve partner ilişkisi (kod ile eşleşme, sohbet, konum, özel gün) aynı hesapta, `UserSettings.activeModules` ile açılır. `gender === 'male'` ise backend ve client modülleri **yalnızca `relationship`**.

API katmanı Controller → Service → Prisma; repository yok. Auth: 15 dakikalık JWT (`sub`, `email`) + DB refresh rotation. Admin: `User.isAdmin`, JWT’de rol yok. Global rate limit 100/dk.

Kritik dosyalar: `schema.prisma`, `auth.service.ts`, `pair.ts`, `gender-modules.ts`, `period.service.ts`, `fertility.service.ts`, `pregnancy.service.ts`, `relationship.service.ts`, `couple-live.service.ts`, `assistant.service.ts`, `notifications.service.ts`, `media.service.ts`, `customFetch.ts`, `AuthContext.tsx`, `apiBase.ts`, `app/index.tsx`.

Asistan **yalnızca** `POST /api/assistant/chat` (Groq). Supabase edge kapalı. Groq fail olursa yine JSON cevap (fallback); ağ hatası UI’da “yanıt üretemedim”.

Makale/SSS/mit bellek içi; gebelik haftası/semptom tipi/bebek adı DB. Media public GET. Prisma `migrations` yok. Render: `render.yaml`, health `/health`, start `node dist/main`, DB için **session pooler** (`pooler.supabase.com:5432`) — direkt `db.*.supabase.co:5432` IPv6 yüzünden Render’dan düşer.

Mobil release API: `app.json extra.productionApiUrl` = `https://pusena-api.onrender.com`. Token AsyncStorage. Birçok wellness ekranı local-only. Premium sahte.

İsim karmaşası: Bloom/Abacus bundle, ürün Pusena, partner kod `BL-`.

Değişiklik yaparken: swagger/orval senkronu, erkek modül kilidinin iki kopyası, PUBLIC_API_URL media URL, APP_ORIGIN Google, cron’un harici tetiklenmesi, APK’nın native ikon/API URL için yeniden EAS build gerektirmesi.

Riskler: seed parolaları kodda, testsizlik, article kalıcılığı, media IDOR, OAuth env, secret’ların sohbet/git geçmişine düşmesi (döndürülmeli — değer yazma).

---

# 30. SON KONTROL

1. README değil, `src` + `schema.prisma` + Expo `app/` incelendi.  
2. Frontend: index → auth → setup → tabs → API katmanı.  
3. Backend: main → modules → controllers.  
4. DB ilişkileri şemadan.  
5. Auth JWT+refresh+Google koddan.  
6. Groq, Google, Supabase, Render, EAS.  
7. Env **yalnızca isim**.  
8. Cron HTTP; queue yok.  
9. İş mantığı (modül, pair, fertility, asistan) açıklandı.  
10. Dosya yolları verildi.  
11. Belirsizler işaretli.  
12. Secret yok.

Bu doküman, başka bir modele verilerek mevcut mimariye uygun geliştirme ve hata ayıklama için bağlam sağlamayı amaçlar.
