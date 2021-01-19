import type { GlobalStateContext } from 'piral-core';
import { Localizable } from './types';

export function createActions(localizer: Localizable) {
  return {
    selectLanguage(ctx: GlobalStateContext, selected: string) {
      ctx.dispatch((state) => {
        localizer.language = selected;
        const previousLanguage = state.language.selected;
        const currentLanguage = selected;

        // emit this event *after* we changed the state container
        setTimeout(() => {
          ctx.emit('select-language', {
            previousLanguage,
            currentLanguage,
          });
        }, 0);

        return {
          ...state,
          language: {
            ...state.language,
            loading: selected === undefined,
            selected,
          },
        };
      });
    },
    translate(_: GlobalStateContext, key: string, variables: any) {
      return localizer && localizer.localizeGlobal(key, variables);
    },
    setTranslations(ctx: GlobalStateContext, language: string, data) {
      localizer.messages[language] = data.global;

      for (const item of data.locals) {
        const api = ctx.apis[item.name];

        if (api) {
          const translations = api.getTranslations();
          translations[language] = item.value;
          api.setTranslations(translations);
        }
      }
    },
    getTranslations(ctx: GlobalStateContext, language: string) {
      return {
        global: localizer.messages[language],
        locals: Object.keys(ctx.apis).map((name) => ({
          name,
          value: ctx.apis[name].getTranslations()[language],
        })),
      };
    },
  };
}
