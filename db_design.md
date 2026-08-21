# BLOOM Database Schema

All tables use UUID primary keys (auto-generated), DateTime timestamps (createdAt, updatedAt).

---

## User

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| email | String | Unique, required |
| password | String | Nullable (null for Google SSO users), bcrypt hashed |
| name | String | Required |
| avatarUrl | String | Nullable (Google profile picture URL for SSO users) |
| googleId | String | Nullable, Unique (Google OAuth subject ID) |
| hasCompletedSetup | Boolean | Default false |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

---

## RefreshToken

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| token | String | Unique, required (hashed) |
| expiresAt | DateTime | Required |
| createdAt | DateTime | Auto |

Index: (userId), (token)

---

## UserSettings

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, Unique, required, ON DELETE CASCADE |
| activeModules | String[] | Default [] (values: "pregnancy", "period", "relationship") |
| pregnancyWeekly | Boolean | Default true |
| pregnancyTips | Boolean | Default true |
| periodReminder | Boolean | Default true |
| fertilityAlert | Boolean | Default true |
| specialDateReminder | Boolean | Default true |
| communityLikes | Boolean | Default true |
| communityComments | Boolean | Default true |
| profilePublic | Boolean | Default true |
| showCommunityPosts | Boolean | Default true |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Note: Created automatically when User is created (at signup).

---

## Pregnancy

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, Unique, required, ON DELETE CASCADE |
| lastMenstrualPeriod | DateTime | Required |
| dueDate | DateTime | Required (computed: LMP + 280 days) |
| isActive | Boolean | Default true |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: (userId)

---

## PregnancyWeekContent (Seed Data)

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| weekNumber | Integer | Unique, required (1-42) |
| title | String | Required |
| babyDevelopment | String | Required (text) |
| babySize | String | Required |
| babyWeight | String | Required |
| organDevelopment | String | Required (text) |
| motherChanges | String | Required (text) |
| commonSymptoms | String[] | Required |
| tips | String[] | Required |
| warnings | String[] | Default [] |

Note: Seeded with Turkish content for weeks 1-40.

---

## PeriodCycle

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| startDate | DateTime | Required |
| endDate | DateTime | Nullable |
| cycleLength | Integer | Required (21-45) |
| periodLength | Integer | Required (2-10) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: (userId, startDate DESC)

---

## PeriodDay

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| cycleId | UUID | FK to PeriodCycle, required, ON DELETE CASCADE |
| date | DateTime | Required |
| flowLevel | Integer | Required (1-5) |
| notes | String | Nullable |
| createdAt | DateTime | Auto |

Index: (userId, date), Unique: (userId, date)

---

## Symptom

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| date | DateTime | Required |
| type | String | Required |
| severity | Integer | Required (1-5) |
| notes | String | Nullable |
| createdAt | DateTime | Auto |

Index: (userId, date)

---

## SymptomType (Seed Data)

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| category | String | Required (Ağrı, Ruh Hali, Fiziksel, Diğer) |
| name | String | Required, Unique |
| displayOrder | Integer | Required |

---

## Relationship

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, Unique, required, ON DELETE CASCADE |
| partnerName | String | Required |
| startDate | DateTime | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

---

## SpecialDate

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| relationshipId | UUID | FK to Relationship, required, ON DELETE CASCADE |
| title | String | Required |
| date | DateTime | Required |
| description | String | Nullable |
| isRecurring | Boolean | Default false |
| reminderDays | Integer | Nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: (userId), (relationshipId)

---

## CommunityPost

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| authorId | UUID | FK to User, required, ON DELETE CASCADE |
| content | String | Required (text) |
| category | String | Required (pregnancy, period, relationship, general) |
| pregnancyWeek | Integer | Nullable |
| likesCount | Integer | Default 0 |
| commentsCount | Integer | Default 0 |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

Index: (authorId), (category), (createdAt DESC)

---

## PostLike

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| postId | UUID | FK to CommunityPost, required, ON DELETE CASCADE |
| createdAt | DateTime | Auto |

Unique: (userId, postId)

---

## SavedPost

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| postId | UUID | FK to CommunityPost, required, ON DELETE CASCADE |
| createdAt | DateTime | Auto |

Unique: (userId, postId)

---

## Comment

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| postId | UUID | FK to CommunityPost, required, ON DELETE CASCADE |
| authorId | UUID | FK to User, required, ON DELETE CASCADE |
| content | String | Required (text) |
| createdAt | DateTime | Auto |

Index: (postId, createdAt)

---

## Report

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| reporterId | UUID | FK to User, required, ON DELETE CASCADE |
| postId | UUID | FK to CommunityPost, required, ON DELETE CASCADE |
| reason | String | Required |
| createdAt | DateTime | Auto |

Unique: (reporterId, postId)

---

## BlockedUser

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| blockedUserId | UUID | FK to User, required, ON DELETE CASCADE |
| createdAt | DateTime | Auto |

Unique: (userId, blockedUserId)

---

## Notification

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, auto-generated |
| userId | UUID | FK to User, required, ON DELETE CASCADE |
| type | String | Required (e.g., "pregnancy_weekly", "period_reminder", "special_date", "community_like", "community_comment") |
| title | String | Required |
| body | String | Required |
| module | String | Required (pregnancy, period, relationship, community, system) |
| referenceId | UUID | Nullable (ID of related entity) |
| isRead | Boolean | Default false |
| createdAt | DateTime | Auto |

Index: (userId, isRead, createdAt DESC)

---

## Entity Relationships Summary

```
User 1──1 UserSettings
User 1──1 Pregnancy (optional)
User 1──N PeriodCycle
User 1──N PeriodDay
User 1──N Symptom
User 1──1 Relationship (optional)
User 1──N CommunityPost
User 1──N PostLike
User 1──N SavedPost
User 1──N Comment
User 1──N Report
User 1──N BlockedUser (as blocker)
User 1──N Notification
User 1──N RefreshToken

PeriodCycle 1──N PeriodDay
Relationship 1──N SpecialDate
CommunityPost 1──N PostLike
CommunityPost 1──N SavedPost
CommunityPost 1──N Comment
CommunityPost 1──N Report
```
