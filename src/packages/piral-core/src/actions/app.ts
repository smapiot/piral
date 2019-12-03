import { ComponentType, cloneElement } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { RouteComponentProps } from 'react-router-dom';
import { withKey, replaceOrAddItem, removeNested } from '../utils';
import {
  LayoutType,
  GlobalState,
  Pilet,
  ComponentsState,
  ErrorComponentsState,
  BaseRegistration,
  RegistryState,
} from '../types';

export function changeLayout(ctx: Atom<GlobalState>, current: LayoutType) {
  swap(ctx, state => ({
    ...state,
    app: withKey(state.app, 'layout', current),
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

export function injectPilet(ctx: Atom<GlobalState>, pilet: Pilet) {
  swap(ctx, state => ({
    ...state,
    modules: replaceOrAddItem(state.modules, pilet, m => m.name === pilet.name),
    registry: removeNested<RegistryState, BaseRegistration>(state.registry, m => m.pilet === pilet.name),
  }));
}

export function setComponent<TKey extends keyof ComponentsState>(
  ctx: Atom<GlobalState>,
  name: TKey,
  component: ComponentsState[TKey],
) {
  swap(ctx, state => ({
    ...state,
    components: withKey(state.components, name, component),
  }));
}

export function setErrorComponent<TKey extends keyof ErrorComponentsState>(
  ctx: Atom<GlobalState>,
  type: TKey,
  component: ErrorComponentsState[TKey],
) {
  swap(ctx, state => ({
    ...state,
    errorComponents: withKey(state.errorComponents, type, component),
  }));
}

export function setRoute<T = {}>(
  ctx: Atom<GlobalState>,
  path: string,
  component: ComponentType<RouteComponentProps<T>>,
) {
  swap(ctx, state => ({
    ...state,
    routes: withKey(state.routes, path, component),
  }));
}

export function includeProvider(ctx: Atom<GlobalState>, provider: JSX.Element) {
  swap(ctx, state => ({
    ...state,
    provider: !state.provider ? provider : cloneElement(provider, undefined, state.provider),
  }));
}
