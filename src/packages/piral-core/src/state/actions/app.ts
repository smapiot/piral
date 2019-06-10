import { swap, Atom } from '@dbeining/react-atom';
import { LayoutType, GlobalState } from '../../types';

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
