import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, StateDispatcher, withKey, withoutKey } from 'piral-core';

export function createState<TState>(ctx: Atom<GlobalState>, id: string, data: TState) {
  swap(ctx, state => ({
    ...state,
    containers: withKey(state.containers, id, data),
  }));
}

export function destroyState(ctx: Atom<GlobalState>, id: string) {
  swap(ctx, state => ({
    ...state,
    containers: withoutKey(state.containers, id),
  }));
}

export function replaceState<TState>(ctx: Atom<GlobalState>, id: string, dispatch: StateDispatcher<TState>) {
  swap(ctx, state => {
    const oldState = state.containers[id];
    const newState = dispatch(oldState);
    return {
      ...state,
      containers: withKey(state.containers, id, {
        ...oldState,
        ...newState,
      }),
    };
  });
}
