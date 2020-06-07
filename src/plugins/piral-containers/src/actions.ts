import { StateDispatcher, withKey, withoutKey, GlobalStateContext } from 'piral-core';

export function createState<TState>(ctx: GlobalStateContext, id: string, data: TState) {
  ctx.dispatch(state => ({
    ...state,
    containers: withKey(state.containers, id, data),
  }));
}

export function destroyState(ctx: GlobalStateContext, id: string) {
  ctx.dispatch(state => ({
    ...state,
    containers: withoutKey(state.containers, id),
  }));
}

export function replaceState<TState>(ctx: GlobalStateContext, id: string, dispatch: StateDispatcher<TState>) {
  ctx.dispatch(state => {
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
