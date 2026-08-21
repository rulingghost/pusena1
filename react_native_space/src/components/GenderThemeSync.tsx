import { useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAppTheme } from '@/src/contexts/ThemeContext';
import { isMaleUser } from '@/src/utils/gender';

/** Cinsiyete göre paleti senkronize eder (erkek = mavi/teal, kadın = pembe). */
export function GenderThemeSync() {
  const { user } = useAuth();
  const { setPaletteKind, paletteKind } = useAppTheme();

  useEffect(() => {
    if (!user) return;
    const next = isMaleUser(user) ? 'male' : 'female';
    if (next !== paletteKind) setPaletteKind(next);
  }, [user, paletteKind, setPaletteKind]);

  return null;
}
