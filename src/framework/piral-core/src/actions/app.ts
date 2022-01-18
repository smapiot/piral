import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router';
import { withKey, replaceOrAddItem, removeNested, withProvider, withRoute } from '../utils';
import {
  LayoutType,
  ComponentsState,
  ErrorComponentsState,
  BaseRegistration,
  RegistryState,
  GlobalStateContext,
  Pilet,
} from '../types';

export function changeLayout(ctx: GlobalStateContext, current: LayoutType) {
  ctx.dispatch((state) => ({
    ...state,
    app: withKey(state.app, 'layout', current),
  }));
}

export function initialize(ctx: GlobalStateContext, loading: boolean, error: Error | undefined, modules: Array<Pilet>) {
  ctx.dispatch((state) => ({
    ...state,
    app: {
      ...state.app,
      error,
      loading,
    },
    modules,
  }));
}

export function injectPilet(ctx: GlobalStateContext, pilet: Pilet) {
  ctx.dispatch((state) => ({
    ...state,
    modules: replaceOrAddItem(state.modules, pilet, (m) => m.name === pilet.name),
    registry: removeNested<RegistryState, BaseRegistration>(state.registry, (m) => m.pilet === pilet.name),
  }));

  ctx.emit('unload-pilet', {
    name: pilet.name,
  });
}

export function setComponent<TKey extends keyof ComponentsState>(
  ctx: GlobalStateContext,
  name: TKey,
  component: ComponentsState[TKey],
) {
  ctx.dispatch((state) => ({
    ...state,
    components: withKey(state.components, name, component),
  }));
}

export function setErrorComponent<TKey extends keyof ErrorComponentsState>(
  ctx: GlobalStateContext,
  type: TKey,
  component: ErrorComponentsState[TKey],
) {
  ctx.dispatch((state) => ({
    ...state,
    errorComponents: withKey(state.errorComponents, type, component),
  }));
}

export function setRoute<T = {}>(
  ctx: GlobalStateContext,
  path: string,
  component: ComponentType<RouteComponentProps<T>>,
) {
  ctx.dispatch(withRoute(path, component));
}

export function includeProvider(ctx: GlobalStateContext, provider: JSX.Element) {
  ctx.dispatch(withProvider(provider));
}
