import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext } from 'piral-core';
import { Localizable } from './types';

export function createActions(localizer: Localizable) {
  return {
    selectLanguage(ctx: Atom<GlobalState>, selected: string) {
      if (selected) {
        swap(ctx, state => {
          localizer.language = selected;
          return {
            ...state,
            app: {
              ...state.app,
              loading: false,
            },
            language: {
              ...state.language,
              selected,
            },
          };
        });
      } else {
        swap(ctx, state => ({
          ...state,
          app: {
            ...state.app,
            loading: true,
          },
        }));
      }
    },
    translate(_: Atom<GlobalState>, key: string, variables: any) {
      return localizer && localizer.localizeGlobal(key, variables);
    },
    setTranslations(this: GlobalStateContext, _: Atom<GlobalState>, language: string, data) {
      localizer.messages[language] = data.global;

      for (const item of data.locals) {
        const api = this.apis[item.name];

        if (api) {
          const translations = api.getTranslations();
          translations[language] = item.value;
          api.setTranslations(translations);
        }
      }
    },
    getTranslations(this: GlobalStateContext, _: Atom<GlobalState>, language: string) {
      return {
        global: localizer.messages[language],
        locals: Object.keys(this.apis).map(name => ({
          name,
          value: this.apis[name].getTranslations()[language],
        })),
      };
    },
  };
}
