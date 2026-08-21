import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/src/theme/colors';

type ThemeMode = 'system' | 'light' | 'dark';
export type PaletteKind = 'female' | 'male';

export type ThemeColors = typeof Colors.light & {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  pregnancy: string;
  period: string;
  relationship: string;
  community: string;
  danger: string;
  success: string;
  warning: string;
  white: string;
  black: string;
  accent: string;
  accentLight: string;
  floPink: string;
  floPinkLight: string;
  gradient: readonly [string, string];
  gradientWarm: readonly [string, string];
  gradientSoft: readonly [string, string];
  peach: string;
  lavender: string;
  mint: string;
  blush: string;
  lilac: string;
  roseGold: string;
  skyBlue: string;
};

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  paletteKind: PaletteKind;
  setPaletteKind: (kind: PaletteKind) => void;
  colors: ThemeColors;
}

const THEME_KEY = 'bloom_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  themeMode: 'system',
  setThemeMode: () => {},
  paletteKind: 'female',
  setPaletteKind: () => {},
  colors: {
    ...Colors.light,
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    pregnancy: Colors.pregnancy,
    period: Colors.period,
    relationship: Colors.relationship,
    community: Colors.community,
    danger: Colors.danger,
    success: Colors.success,
    warning: Colors.warning,
    white: Colors.white,
    black: Colors.black,
    accent: Colors.floPink,
    accentLight: Colors.floPinkLight,
    floPink: Colors.floPink,
    floPinkLight: Colors.floPinkLight,
    gradient: Colors.gradient,
  } as ThemeColors,
});

function buildColors(isDark: boolean, paletteKind: PaletteKind): ThemeColors {
  const male = paletteKind === 'male';
  const surface = male
    ? (isDark ? Colors.maleDark : Colors.maleLight)
    : (isDark ? Colors.dark : Colors.light);
  const primary = male ? Colors.malePrimary : Colors.primary;
  const accent = male ? Colors.maleAccent : Colors.floPink;
  const accentLight = male ? Colors.maleAccentLight : Colors.floPinkLight;

  return {
    ...surface,
    primary,
    primaryLight: male ? Colors.malePrimaryLight : Colors.primaryLight,
    primaryDark: male ? Colors.malePrimaryDark : Colors.primaryDark,
    pregnancy: Colors.pregnancy,
    period: male ? Colors.maleAccent : Colors.period,
    relationship: male ? Colors.malePrimary : Colors.relationship,
    community: Colors.community,
    danger: Colors.danger,
    success: Colors.success,
    warning: Colors.warning,
    white: Colors.white,
    black: Colors.black,
    accent,
    accentLight,
    floPink: accent,
    floPinkLight: accentLight,
    gradient: male ? [Colors.malePrimary, Colors.malePrimaryLight] : Colors.gradient,
    gradientWarm: Colors.gradientWarm,
    gradientSoft: male ? [Colors.malePrimary, Colors.maleAccent] : Colors.gradientSoft,
    peach: Colors.peach,
    lavender: Colors.lavender,
    mint: Colors.mint,
    blush: Colors.blush,
    lilac: Colors.lilac,
    roseGold: Colors.roseGold,
    skyBlue: Colors.skyBlue,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [paletteKind, setPaletteKindState] = useState<PaletteKind>('female');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem('pusena_palette_kind'),
    ]).then(([theme, palette]) => {
      if (theme === 'light' || theme === 'dark' || theme === 'system') setThemeModeState(theme);
      if (palette === 'male' || palette === 'female') setPaletteKindState(palette);
    }).catch(() => {});
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode).catch(() => {});
  }, []);

  const setPaletteKind = useCallback((kind: PaletteKind) => {
    setPaletteKindState(kind);
    AsyncStorage.setItem('pusena_palette_kind', kind).catch(() => {});
  }, []);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = useMemo(() => buildColors(isDark, paletteKind), [isDark, paletteKind]);

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode, paletteKind, setPaletteKind, colors }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
