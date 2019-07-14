import { Localizer } from './localize';
import { PiralLocaleApi, LocalizationMessages, LocaleConfig } from './types';

/**
 * Sets up a new localizer by using the given config.
 * @param config The configuration for the new localizer.
 */
export function setupLocalizer(config: LocaleConfig = {}) {
  const msgs = config.messages || {};
  const lang = config.language || Object.keys(msgs)[0] || 'en';
  return new Localizer(msgs, lang, config.fallback, config.load);
}

/**
 * Creates a new Piral localization API extension.
 * @param config The configuration to use.
 */
export function createLocaleApi(localizer: Localizer): PiralLocaleApi {
  let localTranslations: LocalizationMessages = {};
  return {
    provideTranslations(messages) {
      localTranslations = messages;
    },
    translate(tag, variables) {
      return localizer.localizeLocal(localTranslations, tag, variables);
    },
  };
}
