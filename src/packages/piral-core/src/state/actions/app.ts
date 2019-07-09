import { swap, Atom } from '@dbeining/react-atom';
import { LayoutType, GlobalState } from '../../types';

export function selectLanguage(ctx: Atom<GlobalState>, selected: string) {
  swap(ctx, state => ({
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

export function changeLayout(ctx: Atom<GlobalState>, current: LayoutType) {
  swap(ctx, state => ({
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
