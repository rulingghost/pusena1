import { getWellnessData, setWellnessData } from '@/src/utils/wellnessStorage';

const FEATURE_KEY = 'baby_profile';

export interface BabyProfile {
  birthDate: string | null; // YYYY-MM-DD
  sex: 'girl' | 'boy' | 'unknown';
}

const DEFAULT: BabyProfile = { birthDate: null, sex: 'unknown' };

export async function loadBabyProfile(userId?: string | null): Promise<BabyProfile> {
  try {
    const parsed = await getWellnessData<BabyProfile>(FEATURE_KEY, userId);
    if (!parsed) return DEFAULT;
    return {
      birthDate: parsed.birthDate || null,
      sex: parsed.sex === 'girl' || parsed.sex === 'boy' ? parsed.sex : 'unknown',
    };
  } catch {
    return DEFAULT;
  }
}

export async function saveBabyProfile(profile: BabyProfile, userId?: string | null): Promise<void> {
  await setWellnessData(FEATURE_KEY, profile, userId);
}

export function ageInDays(birthDate: string | null, now = new Date()): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate + 'T00:00:00');
  if (Number.isNaN(birth.getTime()) || birth > now) return null;
  return Math.floor((now.getTime() - birth.getTime()) / (24 * 60 * 60 * 1000));
}

export function ageInMonths(days: number | null): number | null {
  if (days == null) return null;
  return Math.floor(days / 30.4375);
}
