import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { I18n } from 'i18n-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';

import en from '@/locales/en';
import es from '@/locales/es';
import fr from '@/locales/fr';

const LANGUAGE_STORAGE_KEY = '@gym_buddy_language';

export type SupportedLanguage = 'en' | 'es' | 'fr';

export const LANGUAGES = [
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
];

const i18n = new I18n({
  en,
  es,
  fr,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === 'en' || stored === 'es' || stored === 'fr')) {
        setCurrentLanguage(stored);
        i18n.locale = stored;
      } else {
        const deviceLocale = getLocales()[0]?.languageCode;
        const defaultLang = 
          deviceLocale === 'es' ? 'es' : 
          deviceLocale === 'fr' ? 'fr' : 
          'en';
        setCurrentLanguage(defaultLang);
        i18n.locale = defaultLang;
      }
    } catch (error) {
      console.log('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
      i18n.locale = language;
    } catch (error) {
      console.log('Error saving language:', error);
    }
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, string | number>) => {
      return i18n.t(key, options);
    },
    []
  );

  return useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      t,
      isLoading,
      languages: LANGUAGES,
    }),
    [currentLanguage, changeLanguage, t, isLoading]
  );
});
