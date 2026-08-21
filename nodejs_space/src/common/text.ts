/** Turkish-insensitive fold so İ/I/ı all match in search. */
export function foldTr(value: string): string {
  return (value ?? '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

export function matchesTr(haystack: string, needle: string): boolean {
  const q = foldTr(needle).trim();
  if (!q) return true;
  return foldTr(haystack).includes(q);
}
