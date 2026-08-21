export function isMaleGender(gender?: string | null): boolean {
  return gender === 'male';
}

export function filterModulesForGender(modules: string[] | undefined, gender?: string | null): string[] {
  const list = Array.isArray(modules) ? [...modules] : [];
  if (isMaleGender(gender)) return ['relationship'];
  return list;
}
