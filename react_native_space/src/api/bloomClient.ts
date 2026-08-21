/**
 * Hand-written client for endpoints added after the last orval codegen run.
 * Mirrors the generated hooks' conventions so screens can mix both freely.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from './customFetch';

// ---------- Types ----------

export type InsightLevel = 'info' | 'tip' | 'warning' | 'danger' | 'success';

export interface Insight {
  id: string;
  level: InsightLevel;
  module: string;
  title: string;
  body: string;
  reason: string;
  action?: string;
  route?: string;
}

export interface CommunityUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  biography?: string | null;
  postsCount?: number;
  followersCount?: number;
  isFollowing: boolean;
  matchReason?: string | null;
}

export interface CommunityUserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  biography: string | null;
  joinedAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isSelf: boolean;
  canSeePosts: boolean;
  profilePublic?: boolean;
  allowFollow?: boolean;
  canFollow?: boolean;
}

export interface PostSummary {
  id: string;
  content: string;
  category: string;
  pregnancyWeek?: number | null;
  isEdited: boolean;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface MyPostWithComments {
  id: string;
  content: string;
  category: string;
  pregnancyWeek?: number | null;
  isEdited: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  comments: Array<{
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string | null;
    createdAt: string;
  }>;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  category: string;
  emoji: string;
  notes: string | null;
  imageUrls: string[];
}

export interface AssessmentResult {
  goal: string | null;
  tryingDuration: string | null;
  cycleRegularity: string | null;
  contraceptionPast: string | null;
  healthConditions: string[];
  heightCm: number | null;
  weightKg: number | null;
  age: number | null;
  score: number;
  bmi: number | null;
  insights: string[];
  recommendations: string[];
}

export interface FertilityOverview {
  hasData: boolean;
  message: string | null;
  cycleLength: number | null;
  cycleVariation?: number;
  cycleCount?: number;
  ovulationDay: number | null;
  currentCycleDay: number | null;
  phase: { key: string; label: string; description: string } | null;
  fertileWindow: Array<{ label: string; date: string; chance: number; daysAway: number; isToday: boolean }>;
  monthlyChance: number | null;
  factors: Array<{ label: string; impact: string; detail: string }>;
  tips: Array<{ title: string; body: string }>;
  nextOvulationDate: string | null;
}

export interface PartnerGuide {
  viewerGender: string | null;
  perspective: 'male' | 'female' | 'neutral';
  partnerName: string | null;
  isPaired: boolean;
  pregnancyWeek: number | null;
  cyclePhase: string | null;
  cycleDay: number | null;
  headline: string;
  sections: Array<{
    id: string;
    title: string;
    subtitle: string;
    tips: Array<{ icon: string; title: string; body: string }>;
  }>;
}

export interface CoupleQuestion {
  id: string;
  category: string;
  question: string;
  myAnswer?: string | null;
  partnerAnswer?: string | null;
  partnerHasAnswered?: boolean;
  revealed?: boolean;
}

export interface CoupleQuestionsPack {
  items: CoupleQuestion[];
  today: CoupleQuestion;
  total: number;
  isPaired: boolean;
  partnerName: string | null;
}

// ---------- Insights ----------

export function useInsights() {
  return useQuery({
    queryKey: ['dashboard', 'insights'],
    queryFn: () => customFetch<{ items: Insight[] }>('/api/dashboard/insights'),
    staleTime: 60_000,
  });
}

// ---------- Community: people & follow ----------

export function useSearchUsers(query: string, enabled = true) {
  return useQuery({
    queryKey: ['community', 'users', query],
    queryFn: () =>
      customFetch<{ items: CommunityUser[]; total: number }>(
        `/api/community/users/search?q=${encodeURIComponent(query)}`,
      ),
    enabled,
  });
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['community', 'profile', userId],
    queryFn: () => customFetch<CommunityUserProfile>(`/api/community/users/${userId}/profile`),
    enabled: !!userId,
  });
}

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: ['community', 'userPosts', userId],
    queryFn: () =>
      customFetch<{ items: PostSummary[]; total: number }>(`/api/community/users/${userId}/posts`),
    enabled: !!userId,
  });
}

export function useToggleFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      customFetch<{ following: boolean; followersCount: number }>(
        `/api/community/users/${userId}/follow`,
        { method: 'POST' },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['community'] });
    },
  });
}

export function useFollowList(userId: string | undefined, kind: 'followers' | 'following') {
  return useQuery({
    queryKey: ['community', kind, userId],
    queryFn: () =>
      customFetch<{ items: CommunityUser[]; total: number }>(`/api/community/users/${userId}/${kind}`),
    enabled: !!userId,
  });
}

// ---------- Community: my posts & saved ----------

export function useMyPosts() {
  return useQuery({
    queryKey: ['community', 'myPosts'],
    queryFn: () => customFetch<{ items: MyPostWithComments[]; total: number }>('/api/community/my-posts'),
  });
}

export function useSavedPosts() {
  return useQuery({
    queryKey: ['community', 'savedPosts'],
    queryFn: () => customFetch<{ items: PostSummary[]; total: number }>('/api/community/saved-posts'),
  });
}

export function useSavedArticles() {
  return useQuery({
    queryKey: ['community', 'savedArticles'],
    queryFn: () =>
      customFetch<{ items: Array<{ id: string; articleId: string; kind: string; createdAt: string }>; total: number }>(
        '/api/community/saved-articles',
      ),
  });
}

export function useToggleSavedArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, kind = 'article' }: { articleId: string; kind?: string }) =>
      customFetch<{ saved: boolean }>(`/api/community/saved-articles/${articleId}`, {
        method: 'POST',
        body: JSON.stringify({ kind }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['community', 'savedArticles'] }),
  });
}

// ---------- Memories ----------

export function useMemories() {
  return useQuery({
    queryKey: ['memories'],
    queryFn: () => customFetch<{ items: Memory[]; total: number }>('/api/users/memories'),
  });
}

export function useCreateMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Memory, 'id'>) =>
      customFetch<Memory>('/api/users/memories', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memories'] }),
  });
}

export function useDeleteMemory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      customFetch<{ success: boolean }>(`/api/users/memories/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memories'] }),
  });
}

// ---------- Assessment ----------

export function useAssessment() {
  return useQuery({
    queryKey: ['assessment'],
    queryFn: () => customFetch<AssessmentResult | null>('/api/users/assessment'),
  });
}

export function useSaveAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      customFetch<AssessmentResult>('/api/users/assessment', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assessment'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'insights'] });
    },
  });
}

// ---------- Fertility & partner guide ----------

export function useFertilityOverview() {
  return useQuery({
    queryKey: ['period', 'fertility'],
    queryFn: () => customFetch<FertilityOverview>('/api/period/fertility'),
  });
}

export function usePartnerGuide() {
  return useQuery({
    queryKey: ['relationship', 'partnerGuide'],
    queryFn: () => customFetch<PartnerGuide>('/api/relationship/partner-guide'),
  });
}

export function useCoupleQuestions() {
  return useQuery({
    queryKey: ['relationship', 'coupleQuestions'],
    queryFn: () => customFetch<CoupleQuestionsPack>('/api/relationship/couple-questions'),
  });
}

export function useSaveCoupleAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      customFetch(`/api/relationship/couple-questions/${questionId}`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['relationship', 'coupleQuestions'] }),
  });
}

export function usePartnerInfo() {
  return useQuery({
    queryKey: ['partner-info'],
    queryFn: () =>
      customFetch<{
        partnerCode: string | null;
        isPaired: boolean;
        paired?: boolean;
        pairedUserName?: string;
        partnerName?: string;
        pairedUserEmail?: string;
        pairedUserId?: string | null;
      }>('/api/relationship/partner-info'),
  });
}

export function useUnpairPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => customFetch('/api/relationship/unpair', { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partner-info'] });
      qc.invalidateQueries({ queryKey: ['relationship'] });
      qc.invalidateQueries({ queryKey: ['/api/relationship'] });
    },
  });
}

export interface CoupleLocationState {
  distanceKm?: number | null;
  mine: {
    sharingEnabled: boolean;
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    updatedAt: string | null;
    freshness?: string;
  };
  partner: {
    sharingEnabled: boolean;
    latitude: number | null;
    longitude: number | null;
    accuracy?: number | null;
    updatedAt: string | null;
    name: string;
    freshness?: string;
  };
}

export function useCoupleLocation(enabled = true) {
  return useQuery({
    queryKey: ['relationship', 'location'],
    queryFn: () => customFetch<CoupleLocationState>('/api/relationship/live/location'),
    enabled,
    refetchInterval: 30_000,
  });
}

export function useUpsertCoupleLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { latitude?: number; longitude?: number; accuracy?: number; sharingEnabled?: boolean }) =>
      customFetch('/api/relationship/live/location', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['relationship', 'location'] }),
  });
}

export interface CoupleNudge {
  id: string;
  type: string;
  label: string;
  emoji: string;
  body: string;
  status: string;
  fromMe: boolean;
  createdAt: string;
  replies: Array<{ id: string; body: string; fromMe: boolean; createdAt: string }>;
}

export function useCoupleNudges(enabled = true) {
  return useQuery({
    queryKey: ['relationship', 'nudges'],
    queryFn: () =>
      customFetch<{ catalog: Array<{ id: string; label: string; emoji: string; body: string }>; items: CoupleNudge[] }>(
        '/api/relationship/live/nudges',
      ),
    enabled,
    refetchInterval: 12_000,
  });
}

export function useSendNudge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (type: string) =>
      customFetch('/api/relationship/live/nudges', { method: 'POST', body: JSON.stringify({ type }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationship', 'nudges'] });
      qc.invalidateQueries({ queryKey: ['relationship', 'messages'] });
    },
  });
}

export function useReplyNudge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ nudgeId, body }: { nudgeId: string; body: string }) =>
      customFetch(`/api/relationship/live/nudges/${nudgeId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationship', 'nudges'] });
      qc.invalidateQueries({ queryKey: ['relationship', 'messages'] });
    },
  });
}

export function useDeleteNudge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nudgeId: string) =>
      customFetch(`/api/relationship/live/nudges/${nudgeId}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['relationship', 'nudges'] });
      qc.invalidateQueries({ queryKey: ['relationship', 'messages'] });
    },
  });
}

export interface CoupleChatMessage {
  id: string;
  body: string;
  kind: string;
  nudgeId?: string | null;
  fromMe: boolean;
  createdAt: string;
}

export function useCoupleMessages(enabled = true) {
  return useQuery({
    queryKey: ['relationship', 'messages'],
    queryFn: () =>
      customFetch<{ partnerName: string; items: CoupleChatMessage[] }>('/api/relationship/live/messages'),
    enabled,
    refetchInterval: 8000,
  });
}

export function useSendCoupleMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      customFetch('/api/relationship/live/messages', { method: 'POST', body: JSON.stringify({ body }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['relationship', 'messages'] }),
  });
}

// ---------- Profile ----------

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      customFetch('/api/users/profile', { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export interface DoctorSummary {
  generatedAt: string;
  profile: {
    name: string;
    birthYear: number | null;
    gender: string | null;
    heightCm: number | null;
    weightKg: number | null;
  };
  cycle: {
    totalLogged: number;
    averageCycleLength: number | null;
    averagePeriodLength: number | null;
    lastCycles: Array<{
      startDate: string;
      endDate: string | null;
      cycleLength: number;
      periodLength: number;
    }>;
  };
  symptoms: {
    totalLast90Days: number;
    top: Array<{ type: string; count: number; maxSeverity: number; lastDate: string }>;
    recent: Array<{ date: string; type: string; severity: number; notes: string | null }>;
  };
  pregnancy: {
    isActive: boolean;
    babyName: string | null;
    lastMenstrualPeriod: string;
    dueDate: string;
    currentWeek: number;
    currentDay: number;
    daysRemaining: number;
  } | null;
  assessment: {
    goal: string | null;
    tryingDuration: string | null;
    cycleRegularity: string | null;
    healthConditions: string[];
    score: number | null;
  } | null;
  relationship: { partnerName: string; startDate: string } | null;
}

export function useDoctorSummary() {
  return useQuery({
    queryKey: ['users', 'doctor-summary'],
    queryFn: () => customFetch<DoctorSummary>('/api/users/doctor-summary'),
  });
}

export function usePatchNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      customFetch('/api/settings/notifications', { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['/api/settings'] }),
  });
}

export function usePatchPrivacySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      customFetch('/api/settings/privacy', { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['/api/settings'] });
      qc.invalidateQueries({ queryKey: ['/api/community/posts'] });
      qc.invalidateQueries({ queryKey: ['community'] });
    },
  });
}
