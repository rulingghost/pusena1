export type AppGender = 'female' | 'male' | 'other';

export function userGender(user?: { gender?: string | null } | null): AppGender | null {
  const g = user?.gender;
  if (g === 'male' || g === 'female' || g === 'other') return g;
  return null;
}

export function isMaleUser(user?: { gender?: string | null } | null): boolean {
  return userGender(user) === 'male';
}

export function isFemaleUser(user?: { gender?: string | null } | null): boolean {
  return userGender(user) === 'female';
}

export function genderLabelTr(gender?: string | null): string {
  if (gender === 'male') return 'Erkek';
  if (gender === 'female') return 'Kadın';
  if (gender === 'other') return 'Belirtilmedi';
  return 'Belirtilmedi';
}

/** Erkek hesaplarda regl/gebelik modülleri gösterilmez. */
export function filterModulesForGender(modules: string[] | undefined, gender?: string | null): string[] {
  const list = Array.isArray(modules) ? [...modules] : [];
  if (gender === 'male') {
    return list.includes('relationship') ? ['relationship'] : ['relationship'];
  }
  return list;
}

export function defaultModulesForGender(gender?: string | null): string[] {
  if (gender === 'male') return ['relationship'];
  return ['period'];
}
