import { LocalizationMessages } from 'piral-core';
import { en } from './en';

export function getTranslations(translations: LocalizationMessages = {}): LocalizationMessages {
  return {
    ...translations,
    en: {
      ...translations.en,
      ...en,
    },
  };
}
