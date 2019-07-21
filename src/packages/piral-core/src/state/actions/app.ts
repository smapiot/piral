import { swap, Atom } from '@dbeining/react-atom';
import { LayoutType, GlobalState, EventEmitter } from '../../types';

export function selectLanguage(this: EventEmitter, ctx: Atom<GlobalState>, selected: string) {
  swap(ctx, state => {
    this.emit('change-language', {
      selected,
      previous: state.app.language.selected,
    });
    return {
      ...state,
      app: {
        ...state.app,
        language: {
          ...state.app.language,
          selected,
        },
      },
    };
  });
}

export function changeLayout(this: EventEmitter, ctx: Atom<GlobalState>, current: LayoutType) {
  swap(ctx, state => {
    this.emit('change-layout', {
      current,
      previous: state.app.layout.current,
    });
    return {
      ...state,
      app: {
        ...state.app,
        layout: {
          ...state.app.layout,
          current,
        },
      },
    };
  });
}

export function setLoading(this: EventEmitter, ctx: Atom<GlobalState>, loading: boolean) {
  swap(ctx, state => {
    this.emit('loading', {
      loading,
    });
    return {
      ...state,
      app: {
        ...state.app,
        loading,
      },
    };
  });
}
