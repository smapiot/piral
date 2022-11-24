import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router';
import { runPilet } from 'piral-base';
import { withKey, replaceOrAddItem, removeNested, withProvider, withRoute, noop } from '../utils';
import {
  ComponentsState,
  ErrorComponentsState,
  BaseRegistration,
  RegistryState,
  GlobalStateContext,
  Pilet,
  PiletEntry,
} from '../types';

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

export function addPilet(ctx: GlobalStateContext, meta: PiletEntry): Promise<void> {
  return ctx.options
    .loadPilet(meta)
    .then((pilet) => ctx.injectPilet(pilet))
    .then((pilet) => runPilet(ctx.options.createApi, pilet, ctx.options.hooks))
    .then(noop);
}

export function removePilet(ctx: GlobalStateContext, name: string): Promise<void> {
  ctx.dispatch((state) => ({
    ...state,
    modules: state.modules.filter((m) => m.name !== name),
    registry: removeNested<RegistryState, BaseRegistration>(state.registry, (m) => m.pilet === name),
  }));

  ctx.emit('unload-pilet', {
    name,
  });

  return Promise.resolve();
}

export function injectPilet(ctx: GlobalStateContext, pilet: Pilet): Pilet {
  ctx.dispatch((state) => ({
    ...state,
    modules: replaceOrAddItem(state.modules, pilet, (m) => m.name === pilet.name),
    registry: removeNested<RegistryState, BaseRegistration>(state.registry, (m) => m.pilet === pilet.name),
  }));

  ctx.emit('unload-pilet', {
    name: pilet.name,
  });

  return pilet;
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

export function setRoute<T extends { [K in keyof T]?: string } = {}>(
  ctx: GlobalStateContext,
  path: string,
  component: ComponentType<RouteComponentProps<T>>,
) {
  ctx.dispatch(withRoute(path, component));
}

export function includeProvider(ctx: GlobalStateContext, provider: JSX.Element) {
  ctx.dispatch(withProvider(provider));
}
