import { swap } from '@dbeining/react-atom';
import { Extend } from 'piral-core';
import { createActions } from './actions';
import { Localizer } from './localize';
import { DefaultPicker } from './default';
import { PiletLocaleApi, LocalizationMessages, LocaleConfig } from './types';

/**
 * Sets up a new localizer by using the given config.
 * @param config The configuration for the new localizer.
 */
export function setupLocalizer(config: LocaleConfig = {}) {
  const msgs = config.messages || {};
  const languages = Object.keys(msgs);
  const defaultLang = languages[0] || 'en';
  const computeLang = config.language;
  const usedLang = typeof computeLang === 'function' ? computeLang(languages, defaultLang, 'en') : computeLang;
  const language = usedLang || defaultLang;
  return new Localizer(msgs, language, languages.length ? languages : [language], config.fallback);
}

/**
 * Creates a new Piral localization API extension.
 * @param localizer The specific localizer to be used, if any.
 */
export function createLocaleApi(localizer = setupLocalizer()): Extend<PiletLocaleApi> {
  return context => {
    context.defineActions(createActions(localizer));

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        LanguagesPicker: DefaultPicker,
      },
      language: {
        loading: false,
        available: localizer.languages,
        selected: localizer.language,
      },
    }));

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
  };
}
