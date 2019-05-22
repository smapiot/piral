import { swap, Atom } from '@dbeining/react-atom';
import { LayoutType, GlobalState } from '../../types';
import { appendItem, excludeItem } from '../../utils';

export function selectLanguage(selected: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      language: {
        ...state.app.language,
        selected,
      },
    },
  }));
}

export function addLanguage(language: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      language: {
        ...state.app.language,
        available: appendItem(state.app.language.available, language),
      },
    },
  }));
}

export function removeLanguage(language: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      language: {
        ...state.app.language,
        available: excludeItem(state.app.language.available, language),
      },
    },
  }));
}

export function changeLayout(current: LayoutType) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      layout: {
        ...state.app.layout,
        current,
      },
    },
  }));
}
