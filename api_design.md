# BLOOM API Specification

Base URL: `/api`

All authenticated endpoints require `Authorization: Bearer <token>` header.
All list endpoints support `?page=integer&limit=integer` (default page=1, limit=20).

---

## Auth

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/signup | {email: string (required), password: string (required), name: string (required)} | {token: string, refreshToken: string, user: {id: UUID, email: string, name: string, hasCompletedSetup: boolean, createdAt: ISO8601}} | No |
| POST | /api/auth/login | {email: string (required), password: string (required)} | {token: string, refreshToken: string, user: {id: UUID, email: string, name: string, hasCompletedSetup: boolean, createdAt: ISO8601}} | No |
| GET | /api/auth/me | — | {user: {id: UUID, email: string, name: string, hasCompletedSetup: boolean, avatarUrl: string | null, createdAt: ISO8601}} | Bearer |
| POST | /api/auth/refresh | {refreshToken: string (required)} | {token: string, refreshToken: string} | No |
| POST | /api/auth/logout | {refreshToken: string (required)} | {success: boolean} | Bearer |
| POST | /api/auth/forgot-password | {email: string (required)} | {success: boolean, message: string} | No |
| POST | /api/auth/reset-password | {token: string (required), newPassword: string (required)} | {success: boolean} | No |
| PATCH | /api/auth/change-password | {currentPassword: string (required), newPassword: string (required)} | {success: boolean} | Bearer |
| DELETE | /api/auth/account | {password: string (required)} | {success: boolean} | Bearer |
| GET | /api/auth/google?redirect_uri=string | — | Redirect to Google OAuth | No |
| GET | /api/auth/google/callback | — | Redirect to client with token+refreshToken in query params | No |

Notes:
- Access token expires in 15 minutes, refresh token in 30 days.
- `avatarUrl` on /auth/me: for Google SSO users this is the Google profile picture URL (external URL, not managed by this backend's file storage). For email/password users it is null.
- `hasCompletedSetup`: false after initial signup, true after completing module setup.

---

## Users

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| PATCH | /api/users/profile | {name: string (optional)} | {id: UUID, email: string, name: string, avatarUrl: string | null, createdAt: ISO8601} | Bearer |
| GET | /api/users/:userId/public | — | {id: UUID, name: string, avatarUrl: string | null, createdAt: ISO8601} | Bearer |

---

## User Settings / Module Setup

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/settings | — | {activeModules: string[], notifications: NotificationSettings, privacy: PrivacySettings} | Bearer |
| PATCH | /api/settings/modules | {activeModules: string[] (required, values: "pregnancy", "period", "relationship")} | {activeModules: string[]} | Bearer |
| PATCH | /api/settings/notifications | {pregnancyWeekly: boolean (optional), pregnancyTips: boolean (optional), periodReminder: boolean (optional), fertilityAlert: boolean (optional), specialDateReminder: boolean (optional), communityLikes: boolean (optional), communityComments: boolean (optional)} | NotificationSettings | Bearer |
| PATCH | /api/settings/privacy | {profilePublic: boolean (optional), showCommunityPosts: boolean (optional)} | PrivacySettings | Bearer |
| PATCH | /api/settings/complete-setup | — | {hasCompletedSetup: boolean} | Bearer |

**NotificationSettings:** {pregnancyWeekly: boolean, pregnancyTips: boolean, periodReminder: boolean, fertilityAlert: boolean, specialDateReminder: boolean, communityLikes: boolean, communityComments: boolean}

**PrivacySettings:** {profilePublic: boolean, showCommunityPosts: boolean}

---

## Dashboard

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/dashboard | — | {pregnancy: PregnancySummary | null, period: PeriodSummary | null, relationship: RelationshipSummary | null, dailyTip: {title: string, content: string, module: string} | null, recentPosts: CommunityPostPreview[]} | Bearer |

**PregnancySummary:** {currentWeek: integer, currentDay: integer, daysRemaining: integer, babySizeComparison: string, progressPercent: number, trimester: integer}

**PeriodSummary:** {daysUntilNextPeriod: integer, currentCycleDay: integer, nextPeriodDate: ISO8601, calendarDays: {date: ISO8601, type: string}[] (7-day strip, type: "period"|"predicted"|"fertile"|"ovulation"|"normal")}

**RelationshipSummary:** {partnerName: string, daysTogether: integer, startDate: ISO8601, nextSpecialDate: {id: UUID, title: string, date: ISO8601, daysUntil: integer} | null}

**CommunityPostPreview:** {id: UUID, content: string, authorName: string, authorAvatarUrl: string | null, likesCount: integer, commentsCount: integer, createdAt: ISO8601}

---

## Pregnancy

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/pregnancy | {lastMenstrualPeriod: ISO8601 (required)} | {id: UUID, lastMenstrualPeriod: ISO8601, dueDate: ISO8601, currentWeek: integer, currentDay: integer, isActive: boolean, createdAt: ISO8601} | Bearer |
| GET | /api/pregnancy | — | {id: UUID, lastMenstrualPeriod: ISO8601, dueDate: ISO8601, currentWeek: integer, currentDay: integer, daysRemaining: integer, trimester: integer, progressPercent: number, isActive: boolean} | Bearer |
| DELETE | /api/pregnancy | — | {success: boolean} | Bearer |
| GET | /api/pregnancy/weeks/:weekNumber | — | {weekNumber: integer, title: string, babyDevelopment: string, babySize: string, babyWeight: string, organDevelopment: string, motherChanges: string, commonSymptoms: string[], tips: string[], warnings: string[]} | Bearer |
| GET | /api/pregnancy/weeks | — | {weeks: {weekNumber: integer, title: string, babySize: string}[]} | Bearer |

---

## Period Tracking

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/period/setup | {lastPeriodStart: ISO8601 (required), cycleLength: integer (required, 21-45), periodLength: integer (required, 2-10)} | {id: UUID, lastPeriodStart: ISO8601, cycleLength: integer, periodLength: integer, nextPeriodDate: ISO8601, ovulationDate: ISO8601} | Bearer |
| GET | /api/period | — | {currentCycle: {id: UUID, startDate: ISO8601, endDate: ISO8601 | null, cycleLength: integer, periodLength: integer, currentCycleDay: integer, nextPeriodDate: ISO8601, ovulationDate: ISO8601, fertileWindowStart: ISO8601, fertileWindowEnd: ISO8601} | null, averageCycleLength: number} | Bearer |
| POST | /api/period/log | {date: ISO8601 (required), flowLevel: integer (required, 1-5), notes: string (optional)} | {id: UUID, date: ISO8601, flowLevel: integer, notes: string | null, cycleId: UUID} | Bearer |
| GET | /api/period/calendar?month=integer&year=integer | — | {days: {date: ISO8601, type: string, flowLevel: integer | null, hasSymptoms: boolean}[]} | Bearer |
| GET | /api/period/history?page=integer&limit=integer | — | {items: {id: UUID, startDate: ISO8601, endDate: ISO8601 | null, cycleLength: integer, periodLength: integer}[], total: integer, page: integer, totalPages: integer} | Bearer |
| POST | /api/period/start | {date: ISO8601 (required)} | {id: UUID, startDate: ISO8601, cycleLength: integer, periodLength: integer} | Bearer |

---

## Symptoms

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/symptoms | {date: ISO8601 (required), symptoms: {type: string (required), severity: integer (required, 1-5), notes: string (optional)}[] (required)} | {date: ISO8601, symptoms: {id: UUID, type: string, severity: integer, notes: string | null}[]} | Bearer |
| GET | /api/symptoms?date=ISO8601 | — | {date: ISO8601, symptoms: {id: UUID, type: string, severity: integer, notes: string | null}[]} | Bearer |
| GET | /api/symptoms/types | — | {categories: {name: string, types: string[]}[]} | Bearer |

Symptom categories (seeded): Ağrı (Baş ağrısı, Karın ağrısı, Bel ağrısı, Göğüs hassasiyeti), Ruh Hali (Sinirlilik, Üzgünlük, Kaygı, Mutluluk), Fiziksel (Şişkinlik, Yorgunluk, Mide bulantısı, Akne), Diğer (Uykusuzluk, İştah değişimi, Baş dönmesi)

---

## Relationship

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/relationship | {startDate: ISO8601 (required), partnerName: string (required)} | {id: UUID, startDate: ISO8601, partnerName: string, daysTogether: integer, createdAt: ISO8601} | Bearer |
| GET | /api/relationship | — | {id: UUID, startDate: ISO8601, partnerName: string, daysTogether: integer, createdAt: ISO8601} | Bearer |
| PATCH | /api/relationship/:id | {startDate: ISO8601 (optional), partnerName: string (optional)} | {id: UUID, startDate: ISO8601, partnerName: string, daysTogether: integer} | Bearer |
| DELETE | /api/relationship/:id | — | {success: boolean} | Bearer |

---

## Special Dates

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/special-dates | {title: string (required), date: ISO8601 (required), description: string (optional), isRecurring: boolean (optional, default false), reminderDays: integer (optional, values: 1,3,7,14,30)} | {id: UUID, title: string, date: ISO8601, description: string | null, isRecurring: boolean, reminderDays: integer | null, daysUntil: integer, createdAt: ISO8601} | Bearer |
| GET | /api/special-dates?page=integer&limit=integer | — | {items: {id: UUID, title: string, date: ISO8601, description: string | null, isRecurring: boolean, reminderDays: integer | null, daysUntil: integer}[], total: integer, page: integer, totalPages: integer} | Bearer |
| GET | /api/special-dates/:id | — | {id: UUID, title: string, date: ISO8601, description: string | null, isRecurring: boolean, reminderDays: integer | null, daysUntil: integer, createdAt: ISO8601} | Bearer |
| PATCH | /api/special-dates/:id | {title: string (optional), date: ISO8601 (optional), description: string (optional), isRecurring: boolean (optional), reminderDays: integer | null (optional)} | {id: UUID, title: string, date: ISO8601, description: string | null, isRecurring: boolean, reminderDays: integer | null, daysUntil: integer} | Bearer |
| DELETE | /api/special-dates/:id | — | {success: boolean} | Bearer |

---

## Community

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| POST | /api/community/posts | {content: string (required), category: string (required, values: "pregnancy","period","relationship","general"), pregnancyWeek: integer | null (optional)} | {id: UUID, content: string, category: string, pregnancyWeek: integer | null, authorId: UUID, authorName: string, authorAvatarUrl: string | null, likesCount: integer, commentsCount: integer, isLiked: boolean, isSaved: boolean, createdAt: ISO8601} | Bearer |
| GET | /api/community/posts?category=string&page=integer&limit=integer | — | {items: CommunityPost[], total: integer, page: integer, totalPages: integer} | Bearer |
| GET | /api/community/posts/:postId | — | CommunityPost | Bearer |
| DELETE | /api/community/posts/:postId | — | {success: boolean} | Bearer |
| POST | /api/community/posts/:postId/like | — | {liked: boolean, likesCount: integer} | Bearer |
| POST | /api/community/posts/:postId/save | — | {saved: boolean} | Bearer |
| POST | /api/community/posts/:postId/report | {reason: string (required)} | {success: boolean} | Bearer |
| GET | /api/community/posts/:postId/comments?page=integer&limit=integer | — | {items: Comment[], total: integer, page: integer, totalPages: integer} | Bearer |
| POST | /api/community/posts/:postId/comments | {content: string (required)} | {id: UUID, content: string, authorId: UUID, authorName: string, authorAvatarUrl: string | null, createdAt: ISO8601} | Bearer |
| DELETE | /api/community/comments/:commentId | — | {success: boolean} | Bearer |
| POST | /api/community/block/:userId | — | {success: boolean} | Bearer |
| DELETE | /api/community/block/:userId | — | {success: boolean} | Bearer |

**CommunityPost:** {id: UUID, content: string, category: string, pregnancyWeek: integer | null, authorId: UUID, authorName: string, authorAvatarUrl: string | null, likesCount: integer, commentsCount: integer, isLiked: boolean, isSaved: boolean, createdAt: ISO8601}

**Comment:** {id: UUID, content: string, authorId: UUID, authorName: string, authorAvatarUrl: string | null, createdAt: ISO8601}

---

## Notifications

| Method | Path | Request Body | Response Body | Auth |
|--------|------|-------------|---------------|------|
| GET | /api/notifications?page=integer&limit=integer | — | {items: Notification[], total: integer, page: integer, totalPages: integer, unreadCount: integer} | Bearer |
| PATCH | /api/notifications/:id/read | — | {success: boolean} | Bearer |
| PATCH | /api/notifications/read-all | — | {success: boolean} | Bearer |
| GET | /api/notifications/unread-count | — | {count: integer} | Bearer |

**Notification:** {id: UUID, type: string, title: string, body: string, module: string, referenceId: UUID | null, isRead: boolean, createdAt: ISO8601}
