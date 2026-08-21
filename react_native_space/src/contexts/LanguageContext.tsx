import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRANSLATIONS, type Language, type TranslationTree } from '@/src/i18n/translations';
import { customFetch } from '@/src/api/customFetch';

const LANGUAGE_KEY = 'bloom_language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, syncToServer?: boolean) => void;
  t: TranslationTree;
  /** Resolve a dotted key such as `community.follow`; falls back to the key itself. */
  tr: (path: string) => string;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: TRANSLATIONS.tr,
  tr: (p) => p,
  isReady: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((v) => {
        if (v === 'tr' || v === 'en') setLanguageState(v);
      })
      .finally(() => setIsReady(true));
  }, []);

  const setLanguage = useCallback((lang: Language, syncToServer = true) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch(() => {});
    if (syncToServer) {
      customFetch('/api/users/language', {
        method: 'PATCH',
        body: JSON.stringify({ language: lang }),
      }).catch(() => {});
    }
  }, []);

  const t = TRANSLATIONS[language];

  const tr = useCallback(
    (path: string) => {
      const value = path.split('.').reduce<any>((acc, key) => (acc == null ? acc : acc[key]), t);
      return typeof value === 'string' ? value : path;
    },
    [t],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, tr, isReady }),
    [language, setLanguage, t, tr, isReady],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand for components that only need the dictionary. */
export function useT() {
  return useContext(LanguageContext).t;
}
