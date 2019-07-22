import { Localizer } from 'piral-ext';
import { PiletsBag, TranslationsActions } from '../types';

export function createTranslationsActions(localizer: Localizer, apis: PiletsBag): TranslationsActions {
  return {
    translate(key, variables) {
      return localizer.localizeGlobal(key, variables);
    },
    setTranslations(language, data) {
      localizer.messages[language] = data.global;

      for (const item of data.locals) {
        const api = apis[item.name];

        if (api) {
          const translations = api.getTranslations();
          translations[language] = item.value;
          api.setTranslations(translations);
        }
      }
    },
    getTranslations(language) {
      return {
        global: localizer.messages[language],
        locals: Object.keys(apis).map(name => ({
          name,
          value: apis[name].getTranslations()[language],
        })),
      };
    },
  };
}
