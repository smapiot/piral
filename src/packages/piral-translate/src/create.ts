import { Extend } from 'piral-core';
import { createActions } from './actions';
import { Localizer } from './localize';
import { PiletLocaleApi, LocalizationMessages, LocaleConfig } from './types';

/**
 * Sets up a new localizer by using the given config.
 * @param config The configuration for the new localizer.
 */
export function setupLocalizer(config: LocaleConfig = {}) {
  const msgs = config.messages || {};
  const lang = config.language || Object.keys(msgs)[0] || 'en';
  return new Localizer(msgs, lang, config.fallback);
}

/**
 * Creates a new Piral localization API extension.
 * @param localizer The specific localizer to be used, if any.
 */
export function createLocaleApi(localizer = setupLocalizer()): Extend<PiletLocaleApi> {
  return context => {
    context.defineActions(createActions(localizer));

    return () => {
      let localTranslations: LocalizationMessages = {};

      return {
        setTranslations(messages) {
          localTranslations = messages;
        },
        getTranslations() {
          return localTranslations;
        },
        translate(tag, variables) {
          return localizer.localizeLocal(localTranslations, tag, variables);
        },
      };
    };
  }
}
