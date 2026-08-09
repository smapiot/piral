import { LanguageData } from 'piral';

const languages = {
  en: 'English',
  de: 'Deutsch',
};

function getSampleTranslations(language: string) {
  switch (language) {
    case 'de':
      return {
        ...languages,
        sample: 'Willkommen in der Piral Beispielanwendung!',
        search: 'Suche ...',
      };
    case 'en':
    default:
      return {
        ...languages,
        sample: 'Welcome to the Piral Sample App!',
        search: 'Search ...',
      };
  }
}

export function loadLanguage(language: string, data: LanguageData) {
  // Usually these languages / data could be retrieved from a
  // translation service that takes care of *all* translations
  return new Promise<LanguageData>((resolve) =>
    setTimeout(
      () =>
        // In this case we only fake the API access - for such static
        // translations Piral contains a better / simpler mechanism
        resolve({
          ...data,
          global: getSampleTranslations(language),
        }),
      500,
    ),
  );
}
