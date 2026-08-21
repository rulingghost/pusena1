# BLOOM — Kadın Yaşam Asistanı UX Specification

## Design Direction

### Theme
- Dark mode preferred: backgrounds #0F0F0F (primary), #1A1A1A (cards)
- Light mode: #FAFAFA (background), #FFFFFF (cards)
- Full dark/light mode support via system preference + manual toggle

### Color Palette
- **Primary/Brand:** Purple #8B5CF6
- **Gebelik accent:** Amber #F59E0B
- **Regl accent:** Rose #F43F5E
- **Bizim Hikâyemiz accent:** Red #EF4444
- **Topluluk accent:** Emerald #10B981
- Gradient buttons: [#8B5CF6, #A78BFA]
- Text: #E4E4E7 (dark), #27272A (light); muted: #A1A1AA

### Typography
- Display (Nunito Bold): 28-36px — splash, onboarding headings
- Heading (Nunito SemiBold): 20-24px — screen titles, card headings
- Body (Nunito Regular): 16px — content text
- Caption (Nunito Regular): 12-14px — labels, timestamps
- All UI text in Turkish

### Spacing & Radius
- 8pt grid system
- Border radius: sm:8, md:12, lg:16, xl:24
- Cards: rounded 16-24px, soft shadow (dark: subtle border instead)

---

## Screens

### Auth & Onboarding Screens

#### 1. Splash Screen (`app/index.tsx`)
- **Purpose:** App entry, checks auth state
- **UI:** Centered Bloom logo (flower icon + "BLOOM" text), purple gradient background, subtle pulsing animation
- **Behavior:** AuthProvider loads; layout guards handle redirect

#### 2. Onboarding (`app/auth/onboarding.tsx`)
- **Purpose:** First-time welcome, 3 swipeable pages
- **UI:** Full-screen illustrations, heading + subtitle per page, dot indicators, "İleri" button, "Atla" skip link
- **Pages:** 1) "Hayatındaki önemli anları takip et" 2) "Sağlığını ve ilişkini yönet" 3) "Topluluğa katıl"
- **Action:** Last page shows "Başla" → navigates to login

#### 3. Login (`app/auth/login.tsx`)
- **Purpose:** Email/password login + Google SSO
- **UI:** Bloom logo (small), "Hoş Geldin" heading, email input (floating label, keyboard email), password input (floating label, toggle visibility), "Giriş Yap" gradient button, Google SSO button (white bg, Google icon, "Google ile Giriş Yap"), "Hesabın yok mu? Kayıt Ol" link, "Şifremi Unuttum" link
- **Validation:** Email format, password min 6 chars, error shake animation
- **Actions:** Login calls AuthProvider.login(); on success AuthProvider state updates and layout switches to authenticated tabs. Google button opens backend OAuth URL via expo-web-browser.

#### 4. Register (`app/auth/register.tsx`)
- **Purpose:** Create account
- **UI:** "Hesap Oluştur" heading, name input, email input, password input (with strength indicator), confirm password input, "Kayıt Ol" gradient button, Google SSO button, "Zaten hesabın var mı? Giriş Yap" link
- **Validation:** All fields required, passwords match, email format
- **Actions:** Calls AuthProvider.signup(); on success AuthProvider state updates and layout switches to module setup flow

#### 5. Forgot Password (`app/auth/forgot-password.tsx`)
- **Purpose:** Request password reset
- **UI:** "Şifremi Unuttum" heading, description text, email input, "Sıfırlama Bağlantısı Gönder" button, back to login link
- **Action:** POST /api/auth/forgot-password, show success message

#### 6. Google SSO Callback (`app/auth/callback.tsx`)
- **Purpose:** Handle Google OAuth redirect
- **UI:** Loading spinner with "Giriş yapılıyor..." text
- **Behavior:** Extracts token from query params, stores it, updates AuthProvider state

#### 7. Module Setup (`app/setup/index.tsx`)
- **Purpose:** Select which modules to activate (shown after first signup)
- **UI:** "Hangi modülleri kullanmak istersin?" heading, 3 selectable cards (multi-select): Gebelik Takibi (Amber icon), Regl Takibi (Rose icon), Bizim Hikâyemiz (Red icon). Each card has icon, title, short description. "Devam Et" button (enabled when ≥1 selected)
- **Action:** Saves selections, navigates to first selected module's setup

#### 8. Pregnancy Setup (`app/setup/pregnancy.tsx`)
- **Purpose:** Set last menstrual period date
- **UI:** "Gebelik Bilgileri" heading, Amber accent, date picker for LMP ("Son adet tarihi"), calculated due date display, "Devam Et" button
- **Action:** POST /api/pregnancy, proceed to next setup or tabs

#### 9. Period Setup (`app/setup/period.tsx`)
- **Purpose:** Set period tracking baseline
- **UI:** "Regl Bilgileri" heading, Rose accent, date picker for last period start, cycle length selector (21-45 days, default 28), period length selector (2-10 days, default 5), "Devam Et" button
- **Action:** POST /api/period/setup, proceed

#### 10. Relationship Setup (`app/setup/relationship.tsx`)
- **Purpose:** Set relationship info
- **UI:** "İlişki Bilgileri" heading, Red accent, partner name input, relationship start date picker, "Devam Et" button
- **Action:** POST /api/relationship, proceed to tabs

### Authenticated Tab Screens

#### 11. Ana Sayfa / Dashboard (`app/tabs/home.tsx`)
- **Purpose:** Dynamic dashboard showing active module summaries
- **UI:** "Merhaba, {name}" greeting, notification bell icon (with unread badge count) in header. Dynamic cards based on active modules:
  - **Pregnancy Card** (Amber border/accent): current week ("Hafta 24"), days remaining, baby size comparison text, progress bar (week/40)
  - **Period Card** (Rose border/accent): days until next period, current cycle day, mini 7-day calendar strip with color-coded dots
  - **Relationship Card** (Red border/accent): real-time days-together counter ("142 gün birlikte"), next upcoming special date
  - **Daily Tip Card:** contextual tip based on active modules
  - **Community Preview:** 2 recent community posts, "Tümünü Gör" link
- **Actions:** Tap any card → navigate to respective module detail. Tap bell → push to notifications screen.

#### 12. Takip Hub (`app/tabs/tracking.tsx`)
- **Purpose:** Entry point to tracking modules
- **UI:** "Takip" heading, cards for each active module:
  - Gebelik Takibi card (Amber) — current week summary, tap to detail
  - Regl Takibi card (Rose) — cycle status, tap to calendar
  - Each card shows key metric + chevron
- **Actions:** Tap card → push to respective detail screen

#### 13. Topluluk Feed (`app/tabs/community.tsx`)
- **Purpose:** Community posts feed
- **UI:** "Topluluk" heading, category filter chips (Tümü, Gebelik, Regl, İlişki, Genel) horizontally scrollable, FAB "+ Paylaş" button. Post cards: avatar + username + timestamp, content text (max 3 lines), optional image, like count + comment count + save icon. Infinite scroll with skeleton loading.
- **Actions:** Tap post → push to post detail. Tap FAB → push to create post. Tap avatar → push to user profile.

#### 14. Bizim Hikâyemiz Dashboard (`app/tabs/story.tsx`)
- **Purpose:** Relationship module home
- **UI:** Red accent theme. Hero section: couple photo (or placeholder), partner name, real-time counter ("birlikte geçen süre: 1 yıl, 3 ay, 15 gün"), animated heart. Special dates section: upcoming dates list (title, date, countdown badge), "Tümünü Gör" link. "+ Özel Tarih Ekle" button.
- **Actions:** Tap special date → push to detail. Tap add → push to create. Tap couple photo area → push to couple profile.

#### 15. Profil (`app/tabs/profile.tsx`)
- **Purpose:** User profile and settings entry
- **UI:** Avatar (with edit icon overlay), name, email, member since date. Menu items: "Profili Düzenle", "Bildirim Ayarları", "Gizlilik Ayarları", "Tema" (dark/light toggle), "Hesap Ayarları", "Çıkış Yap" (danger color). Each item is a row with icon + label + chevron.
- **Actions:** Tap menu item → push to respective screen. "Çıkış Yap" shows confirmation bottom sheet → calls AuthProvider.logout(); AuthProvider state updates and layout switches to unauthenticated stack.

### Non-Tab Screens (outside tabs folder)

#### 16. Notifications (`app/notifications.tsx`)
- **Purpose:** In-app notification center
- **UI:** "Bildirimler" heading with back arrow, "Tümünü Okundu İşaretle" text button. List of notification cards: icon (color-coded by module), title, body, timestamp, read/unread indicator (dot). Empty state: "Henüz bildirim yok"
- **Actions:** Tap notification → navigate to relevant content. Tap mark all read.

#### 17. Pregnancy Detail (`app/pregnancy/index.tsx`)
- **Purpose:** Detailed pregnancy dashboard
- **UI:** Amber accent. Current week hero (large week number, trimester label, progress ring). Baby section: size comparison, weight, development summary. Mother section: body changes, common symptoms. Tips & warnings cards. "Tüm Haftalar" button.
- **Data:** From GET /api/pregnancy and GET /api/pregnancy/weeks/:weekNumber

#### 18. All Weeks View (`app/pregnancy/weeks.tsx`)
- **Purpose:** Browse all 40 pregnancy weeks
- **UI:** Grid or list of week cards (1-40), current week highlighted, each showing week number + baby size. Past weeks dimmed, future weeks lighter.
- **Action:** Tap week → push to week detail

#### 19. Week Detail (`app/pregnancy/weeks/[weekNumber].tsx`)
- **Purpose:** Detailed content for a specific pregnancy week
- **UI:** Week number heading, baby development section (size, weight, organ development), mother changes section, common symptoms list, tips list, warnings (if any, highlighted in amber). Swipe or arrows to navigate between weeks.

#### 20. Period Calendar (`app/period/index.tsx`)
- **Purpose:** Full calendar view for period tracking
- **UI:** Rose accent. Custom calendar component: period days (rose fill), predicted period (rose outline/lighter), ovulation day (purple dot), fertile window (purple light fill), today (ring). Legend below calendar. Below calendar: current cycle info (cycle day, next period date, next ovulation estimate). "+ Regl Günü Ekle" button. Disclaimer text: "Doğurganlık tahminleri yalnızca bilgilendirme amaçlıdır."
- **Actions:** Tap date → log/edit period day. Tap add → start new period.

#### 21. Symptom Log (`app/period/symptoms.tsx`)
- **Purpose:** Log symptoms for a period day
- **UI:** Date selector at top, symptom categories (Ağrı, Ruh Hali, Fiziksel, Diğer) as sections. Each symptom: icon + name + severity slider (1-5). Notes text area. "Kaydet" button.
- **Action:** POST /api/symptoms

#### 22. Period History (`app/period/history.tsx`)
- **Purpose:** View past cycles
- **UI:** List of past cycles: start date, end date, cycle length, period length. Average cycle length stat at top. Tap cycle → expand to show logged symptoms.

#### 23. Special Dates List (`app/story/dates.tsx`)
- **Purpose:** All special dates
- **UI:** List of special date cards: title, date, countdown ("3 gün kaldı" or "15 gün önce"), recurring badge if applicable. FAB to add new.

#### 24. Create/Edit Special Date (`app/story/create-date.tsx`)
- **Purpose:** Add or edit a special date
- **UI:** Title input, date picker, description textarea, recurring toggle, reminder days selector (1, 3, 7, 14, 30), "Kaydet" gradient button
- **Action:** POST or PATCH /api/special-dates

#### 25. Couple Profile (`app/story/couple-profile.tsx`)
- **Purpose:** View/edit couple info
- **UI:** Couple photo (editable), partner name (editable), relationship start date (editable), days together stat. "Kaydet" button.
- **Action:** PATCH /api/relationship/:id

#### 26. Post Detail (`app/community/[postId]/index.tsx`)
- **Purpose:** View full post with comments
- **UI:** Post content (full text + image), author info, like/save/report actions. Comments list below. Comment input at bottom (text input + send button). Report and block in overflow menu.
- **Actions:** Like, comment, save, report post, block user

#### 27. Create Post (`app/community/create.tsx`)
- **Purpose:** Create new community post
- **UI:** Category selector (chips), content textarea (placeholder: "Düşüncelerini paylaş..."), optional image picker, pregnancy week auto-tag if pregnancy active. "Paylaş" gradient button.
- **Action:** POST /api/community/posts

#### 28. User Profile (`app/community/user/[userId].tsx`)
- **Purpose:** Public profile of another user
- **UI:** Avatar, name, member since, their posts list. Block user option in header menu.

#### 29. Edit Profile (`app/profile/edit.tsx`)
- **Purpose:** Edit own profile
- **UI:** Avatar with camera icon overlay, name input, email (read-only), "Kaydet" button
- **Action:** PATCH /api/users/profile

#### 30. Notification Settings (`app/profile/notification-settings.tsx`)
- **Purpose:** Per-module notification toggles
- **UI:** Sections: Gebelik (haftalık gelişim, ipuçları), Regl (regl hatırlatma, doğurganlık), İlişki (özel tarih hatırlatma), Topluluk (beğeni, yorum). Each with toggle switch.
- **Action:** PATCH /api/settings/notifications

#### 31. Privacy Settings (`app/profile/privacy-settings.tsx`)
- **Purpose:** Privacy controls
- **UI:** "Profilimi herkese açık göster" toggle, "Topluluk paylaşımlarımı göster" toggle
- **Action:** PATCH /api/settings/privacy

#### 32. Account Settings (`app/profile/account-settings.tsx`)
- **Purpose:** Account management
- **UI:** "Şifre Değiştir" section (current + new + confirm password), "Hesabı Sil" danger button with confirmation modal
- **Actions:** PATCH /api/auth/change-password, DELETE /api/auth/account

---

## File Structure

```
app/
  _layout.tsx              — Root layout: AuthProvider wrapper, font loading, theme provider. If isLoading → splash. Routes to auth or tabs based on isAuthenticated.
  index.tsx                — Splash/entry, redirects based on auth state
  
  auth/
    _layout.tsx            — If isAuthenticated → <Redirect href="/tabs/home" />. Returns <Stack>.
    login.tsx
    register.tsx
    onboarding.tsx
    forgot-password.tsx
    callback.tsx           — Google SSO callback
  
  setup/
    _layout.tsx            — Auth guard (must be authenticated). Stack layout.
    index.tsx              — Module selection
    pregnancy.tsx
    period.tsx
    relationship.tsx
  
  tabs/
    _layout.tsx            — If !isAuthenticated → <Redirect href="/auth/login" />. Returns <Tabs> with 5 tabs.
    home.tsx               — Ana Sayfa
    tracking.tsx           — Takip
    community.tsx          — Topluluk
    story.tsx              — Bizim Hikâyemiz
    profile.tsx            — Profil
  
  notifications.tsx
  
  pregnancy/
    index.tsx              — Pregnancy detail
    weeks.tsx              — All weeks
    weeks/
      [weekNumber].tsx     — Week detail
  
  period/
    index.tsx              — Period calendar
    symptoms.tsx           — Symptom log
    history.tsx            — Period history
  
  story/
    dates.tsx              — Special dates list
    create-date.tsx        — Create/edit special date
    couple-profile.tsx     — Couple profile
  
  community/
    create.tsx             — Create post
    [postId]/
      index.tsx            — Post detail
    user/
      [userId].tsx         — User profile
  
  profile/
    edit.tsx
    notification-settings.tsx
    privacy-settings.tsx
    account-settings.tsx
```

---

## Navigation

### Unauthenticated Flow
- `auth/_layout.tsx` guards: if authenticated → redirect to `/tabs/home`
- Stack: onboarding → login ↔ register, login → forgot-password
- Google SSO: login/register → opens browser → callback.tsx extracts token → AuthProvider updates → layout redirects

### Post-Signup Setup Flow
- After first registration, user is authenticated but has no modules configured
- `setup/_layout.tsx`: auth-guarded stack
- Flow: module selection → conditional setup screens → on completion, navigate to `/tabs/home`
- Setup completion stored via user settings (hasCompletedSetup flag)

### Authenticated Flow
- `tabs/_layout.tsx` guards: if not authenticated → redirect to `/auth/login`
- Bottom tabs (5): Ana Sayfa (home icon), Takip (activity icon), Topluluk (users icon), Bizim Hikâyemiz (heart icon), Profil (user icon)
- From tabs, push to non-tab screens via stack navigation

### Key Navigation Paths
- Home → tap notification bell → push `/notifications`
- Home → tap pregnancy card → push `/pregnancy`
- Home → tap period card → push `/period`
- Home → tap relationship card → push `/tabs/story`
- Tracking → tap pregnancy → push `/pregnancy`
- Tracking → tap period → push `/period`
- Pregnancy → tap "Tüm Haftalar" → push `/pregnancy/weeks`
- Pregnancy weeks → tap week → push `/pregnancy/weeks/[weekNumber]`
- Period → tap date → push `/period/symptoms`
- Period → tap history → push `/period/history`
- Story → tap add date → push `/story/create-date`
- Story → tap date → push `/story/dates`
- Story → tap couple area → push `/story/couple-profile`
- Community → tap post → push `/community/[postId]`
- Community → tap FAB → push `/community/create`
- Community → tap avatar → push `/community/user/[userId]`
- Profile → tap menu items → push respective `/profile/*` screens
- Profile → tap "Çıkış Yap" → confirmation bottom sheet → logout → AuthProvider state updates → layout switches to auth stack

---

## Animation & Motion

- **Screen transitions:** fade+slide (right for push, left for pop)
- **Button press:** scale 0.97 spring + haptic (skip haptic on web)
- **Cards:** press scale 0.98, subtle shadow lift
- **Dashboard cards:** staggered fade-in on load (100ms delay between cards)
- **Period calendar:** smooth month transition slide
- **Days counter (relationship):** counting-up number animation on mount
- **Loading:** skeleton shimmer on all list/detail screens
- **Bottom sheets:** multi-snap with backdrop blur (logout confirmation, report)
- **Tab transitions:** cross-fade
- **Respect reduced motion preferences**

---

## Component Standards

- **Buttons:** Gradient fill (primary), outlined (secondary), text-only (ghost), red fill (danger). All have press animation, loading spinner state, disabled opacity.
- **Inputs:** Floating labels, focus border color animation (purple), error state with red border + shake + error message below, password toggle eye icon.
- **Cards:** Rounded 16-24px, module-colored left border or accent, press animation for interactive cards.
- **Calendar:** Custom component — color-coded days (rose for period, purple for fertile, amber dots for symptoms), swipeable months.
- **Lists:** FlatList with staggered entry animation, pull-to-refresh, infinite scroll pagination.
- **Empty states:** Illustration + Turkish message + action button where applicable.
- **Error states:** Turkish error message + "Tekrar Dene" retry button.
- **Accessibility:** Contrast ≥ 4.5:1, touch targets 44pt+, accessible labels on all interactive elements.

---

## State Management

- **AuthProvider (Context):** user, isAuthenticated, isLoading, login, signup, logout, refreshToken
- **Module state:** which modules are active (stored in user settings, fetched on auth)
- **React Query:** all server data fetching, caching, pagination
- **Local state:** form inputs, UI toggles, bottom sheet visibility
