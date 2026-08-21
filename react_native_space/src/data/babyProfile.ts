import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'bloom_baby_profile';

export interface BabyProfile {
  birthDate: string | null; // YYYY-MM-DD
  sex: 'girl' | 'boy' | 'unknown';
}

const DEFAULT: BabyProfile = { birthDate: null, sex: 'unknown' };

export async function loadBabyProfile(): Promise<BabyProfile> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as BabyProfile;
    return {
      birthDate: parsed.birthDate || null,
      sex: parsed.sex === 'girl' || parsed.sex === 'boy' ? parsed.sex : 'unknown',
    };
  } catch {
    return DEFAULT;
  }
}

export async function saveBabyProfile(profile: BabyProfile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
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
