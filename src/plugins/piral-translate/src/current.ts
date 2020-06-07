import { cookie, storage } from 'piral-core';

function getUserLocaleUnchecked(defaultLocale: string, remoteLocale: string) {
  const storedLocale = cookie.getItem('_culture') || storage.getItem('locale');

  if (storedLocale) {
    return storedLocale;
  } else if (remoteLocale) {
    return remoteLocale.toLowerCase().substring(0, 2);
  } else if (navigator.language) {
    return navigator.language.substring(0, 2);
  }

  return defaultLocale;
}

export function getUserLocale(availableLocales: Array<string>, defaultLocale: string, fallbackLocale?: string) {
  const selected = getUserLocaleUnchecked(defaultLocale, fallbackLocale || '');

  if (availableLocales.indexOf(selected) !== -1) {
    return selected;
  }

  return defaultLocale;
}
