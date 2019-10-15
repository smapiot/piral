import { ComponentType } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { RouteComponentProps } from 'react-router-dom';
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

export function defineAction(this: GlobalStateContext, ctx: Atom<GlobalState>, actionName: string, action: any) {
  this[actionName] = (...args) => action.call(this, ctx, ...args);
}

export function defineActions(this: GlobalStateContext, ctx: Atom<GlobalState>, actions: any) {
  for (const actionName of Object.keys(actions)) {
    const action = actions[actionName];
    defineAction.call(this, ctx, actionName, action);
  }
}
