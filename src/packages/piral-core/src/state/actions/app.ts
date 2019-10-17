import { ComponentType, cloneElement } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { RouteComponentProps } from 'react-router-dom';
import { LayoutType, GlobalState, Pilet, ComponentsState } from '../../types';

export function changeLayout(ctx: Atom<GlobalState>, current: LayoutType) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      layout: current,
    },
  }));
}

export function initialize(ctx: Atom<GlobalState>, loading: boolean, error: Error | undefined, modules: Array<Pilet>) {
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
  component: ComponentsState[TKey],
) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      [name]: component,
    },
  }));
}

export function setRoute<T = {}>(
  ctx: Atom<GlobalState>,
  path: string,
  component: ComponentType<RouteComponentProps<T>>,
) {
  swap(ctx, state => ({
    ...state,
    routes: {
      ...state.routes,
      [path]: component,
    },
  }));
}

export function includeProvider(ctx: Atom<GlobalState>, provider: JSX.Element) {
  swap(ctx, state => ({
    ...state,
    provider: !state.provider ? provider : cloneElement(provider, undefined, state.provider),
  }));
}
