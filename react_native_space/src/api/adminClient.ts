import { customFetch } from './customFetch';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  totalPosts: number;
  totalComments: number;
  deletedAccounts: number;
  pregnancyUsers: number;
  periodUsers: number;
  relationshipUsers: number;
  notificationsSent: number;
  pendingSetup?: number;
  activePregnancies?: number;
  symptomsLogged?: number;
  symptomTypesCount?: number;
  babyNamesCount?: number;
  pregnancyWeeksCount?: number;
  specialDatesCount?: number;
  unreadNotifications?: number;
  pairedCouples?: number;
  openNudges?: number;
  coupleMessages?: number;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  nickname?: string;
  biography?: string;
  isAdmin?: boolean;
  hasCompletedSetup?: boolean;
  activeModules?: string[];
}

export interface SendAdminNotificationPayload {
  title: string;
  body: string;
  userId?: string;
  userIds?: string[];
  module?: string;
  type?: string;
  targetModule?: string;
}

export interface PregnancyWeekListItem {
  weekNumber: number;
  title: string;
  babySize: string;
  babyWeight: string;
}

export interface PregnancyWeekDetail extends PregnancyWeekListItem {
  babyDevelopment: string;
  organDevelopment: string;
  motherChanges: string;
  letterFromBaby?: string | null;
  commonSymptoms: string[];
  tips: string[];
  warnings: string[];
}

export interface SymptomTypeItem {
  id: string;
  category: string;
  name: string;
  displayOrder: number;
}

export interface BabyNameItem {
  id: string;
  name: string;
  gender: string;
  meaning: string;
  origin: string;
  isPopular: boolean;
}

export interface AdminArticleItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  categoryName?: string;
  summary: string;
  content: string[];
}

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  categoryName?: string;
}

export interface AdminMythItem {
  id: string;
  statement: string;
  explanation: string;
  isTrue?: boolean;
}

export interface AdminPostWithComments {
  id: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likesCount: number;
  commentsCount: number;
  isEdited?: boolean;
  createdAt: string;
  comments: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
  }[];
}

export const adminClient = {
  getStats: () => customFetch<AdminStats>('/api/admin/stats'),
  updateUser: (userId: string, data: UpdateAdminUserPayload) =>
    customFetch(`/api/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  sendNotification: (data: SendAdminNotificationPayload) =>
    customFetch<{ success: boolean; sentCount: number }>('/api/admin/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPostsWithComments: (page = 1, limit = 100) =>
    customFetch<{ items: AdminPostWithComments[]; total: number }>(
      `/api/admin/posts-with-comments?page=${page}&limit=${limit}`,
    ),
  updatePost: (postId: string, data: { content?: string; category?: string }) =>
    customFetch(`/api/admin/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateComment: (commentId: string, content: string) =>
    customFetch(`/api/admin/comments/${commentId}`, { method: 'PATCH', body: JSON.stringify({ content }) }),
  deletePost: (postId: string) =>
    customFetch(`/api/admin/posts/${postId}`, { method: 'DELETE' }),
  deleteComment: (commentId: string) =>
    customFetch(`/api/admin/comments/${commentId}`, { method: 'DELETE' }),
  getPregnancyWeeks: () => customFetch<PregnancyWeekListItem[]>('/api/admin/content/pregnancy-weeks'),
  getPregnancyWeekDetail: (weekNumber: number) =>
    customFetch<PregnancyWeekDetail>(`/api/admin/content/pregnancy-weeks/${weekNumber}`),
  updatePregnancyWeek: (weekNumber: number, data: Partial<PregnancyWeekDetail>) =>
    customFetch(`/api/admin/pregnancy/weeks/${weekNumber}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getSymptomTypes: () => customFetch<SymptomTypeItem[]>('/api/admin/content/symptom-types'),
  updateSymptomType: (id: string, data: Partial<SymptomTypeItem>) =>
    customFetch(`/api/admin/content/symptom-types/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getBabyNames: (page = 1, limit = 500, search?: string) =>
    customFetch<{ items: BabyNameItem[]; total: number }>(
      `/api/admin/content/baby-names?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    ),
  updateBabyName: (id: string, data: Partial<BabyNameItem>) =>
    customFetch(`/api/admin/content/baby-names/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getArticlesContent: () =>
    customFetch<{ articles: AdminArticleItem[]; faqs: AdminFaqItem[]; myths: AdminMythItem[] }>(
      '/api/admin/content/articles',
    ),
  updateArticle: (id: string, data: Record<string, unknown>) =>
    customFetch(`/api/admin/content/articles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateFaq: (id: string, data: Record<string, unknown>) =>
    customFetch(`/api/admin/content/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateMyth: (id: string, data: Record<string, unknown>) =>
    customFetch(`/api/admin/content/myths/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const MODULE_LABELS: Record<string, string> = {
  pregnancy: 'Gebelik',
  period: 'Regl',
  relationship: 'İlişki',
  sistem: 'Sistem',
  community: 'Topluluk',
};

export function modLabel(m: string) {
  return MODULE_LABELS[m] ?? m;
}
