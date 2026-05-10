'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, getDictionary, dictionaries } from '@/lib/i18n/dictionaries';

type I18nContextType = {
  locale: Locale;
  t: typeof dictionaries['vi'];
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRegion = localStorage.getItem('pho_gear_region');
    if (savedRegion === 'us') {
      setLocaleState('en');
    } else {
      setLocaleState('vi');
    }
    setMounted(false); // Force re-render if needed, but actually we want to handle hydration
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('pho_gear_region', newLocale === 'en' ? 'us' : 'vn');
  };

  const t = getDictionary(locale);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
