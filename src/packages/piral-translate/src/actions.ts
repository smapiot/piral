import { swap, Atom, deref } from '@dbeining/react-atom';
import { GlobalState, GlobalStateContext } from 'piral-core';

function getLocalizer(ctx: Atom<GlobalState>) {
  return deref(ctx).localizer;
}

export function selectLanguage(ctx: Atom<GlobalState>, selected: string) {
  swap(ctx, state => {
    state.localizer.language = selected;
    return {
      ...state,
      language: {
        ...state.language,
        selected,
      },
    };
  });
}

export function translate(ctx: Atom<GlobalState>, key: string, variables: any) {
  const localizer = getLocalizer(ctx);
  return localizer && localizer.localizeGlobal(key, variables);
}

export function setTranslations(this: GlobalStateContext, ctx: Atom<GlobalState>, language: string, data) {
  const localizer = getLocalizer(ctx);

  if (localizer) {
    localizer.messages[language] = data.global;

    for (const item of data.locals) {
      const api = this.apis[item.name];

      if (api) {
        const translations = api.getTranslations();
        translations[language] = item.value;
        api.setTranslations(translations);
      }
    }
  }
}

export function getTranslations(this: GlobalStateContext, ctx: Atom<GlobalState>, language: string) {
  const localizer = getLocalizer(ctx);
  return {
    global: localizer.messages[language],
    locals: Object.keys(this.apis).map(name => ({
      name,
      value: this.apis[name].getTranslations()[language],
    })),
  };
}
