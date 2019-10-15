import { ReactPortal, ComponentType } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { withoutKey, includeItem } from '../../utils';
import { LayoutType, GlobalState, GlobalStateContext, Pilet, ComponentsState } from '../../types';

export function changeLayout(this: GlobalStateContext, ctx: Atom<GlobalState>, current: LayoutType) {
  swap(ctx, state => {
    this.emit('change-layout', {
      current,
      previous: state.app.layout,
    });
    return {
      ...state,
      app: {
        ...state.app,
        layout: current,
      },
    };
  });
}

export function initialize(
  this: GlobalStateContext,
  ctx: Atom<GlobalState>,
  loading: boolean,
  error: Error | undefined,
  modules: Array<Pilet>,
) {
  // this.emit('loading', {
  //   loading,
  // });
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      error,
      loading,
    },
    modules,
  }));
}

export function setComponent<TKey extends keyof ComponentsState>(
  ctx: Atom<GlobalState>,
  name: TKey,
  component: ComponentType<ComponentsState[TKey]>,
) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      [name]: component,
    },
  }));
}

export function setLoading(this: GlobalStateContext, ctx: Atom<GlobalState>, loading: boolean) {
  // this.emit('loading', {
  //   loading,
  // });
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      loading,
    },
  }));
}

export function defineAction(this: GlobalStateContext, ctx: Atom<GlobalState>, actionName: string, action: any) {
  this[actionName] = (...args) => action.call(this, ctx, ...args);
}

export function defineActions(this: GlobalStateContext, ctx: Atom<GlobalState>, actions: any) {
  for (const actionName of Object.keys(actions)) {
    const action = actions[actionName];
    defineAction.call(this, ctx, actionName, action);
  }
}

export function destroyPortal(ctx: Atom<GlobalState>, id: string) {
  swap(ctx, state => ({
    ...state,
    portals: withoutKey(state.portals, id),
  }));
}

export function showPortal(ctx: Atom<GlobalState>, id: string, entry: ReactPortal) {
  swap(ctx, state => ({
    ...state,
    portals: {
      ...state.portals,
      [id]: includeItem(state.portals[id], entry),
    },
  }));
}
