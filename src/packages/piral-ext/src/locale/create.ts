import { PiralLocaleApi, LocalizationMessages, LocaleConfig } from './types';
import { Localizer } from './localize';

/**
 * Sets up a new localizer by using the given config.
 * @param config The configuration for the new localizer.
 */
export function setupLocalizer(config: LocaleConfig = {}) {
  return new Localizer(config.messages || {});
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
