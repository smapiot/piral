import { LocalizationMessages } from 'piral-core';
import { en } from './en';

export function getTranslations(translations: LocalizationMessages = {}): LocalizationMessages {
  return {
    ...translations,
    // en: {
    //   ...translations.en,
    //   ...en,
    // },
  };
}

export function getLanguage(language?: string) {
  if (typeof language === 'string') {
    return language;
  }

  return navigator.language;
}
