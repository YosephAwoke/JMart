import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { LanguageCode } from '@jmart/shared';
import { DEFAULT_LANGUAGE, translations } from '@jmart/shared';

type TranslationSet = Record<keyof typeof translations.en, string>;

interface LocaleContextValue {
  language: LanguageCode;
  toggleLanguage: () => void;
  setLanguage: (language: LanguageCode) => void;
  t: TranslationSet;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);
const STORAGE_KEY = 'jmart-language';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    return stored === 'am' || stored === 'en' ? stored : DEFAULT_LANGUAGE;
  });

  const value = useMemo<LocaleContextValue>(() => {
    const setLanguage = (nextLanguage: LanguageCode) => {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    };

    return {
      language,
      toggleLanguage: () => setLanguage(language === 'en' ? 'am' : 'en'),
      setLanguage,
      t: translations[language] as TranslationSet
    };
  }, [language]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }

  return context;
}