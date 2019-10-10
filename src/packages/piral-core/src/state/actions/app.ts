import { ReactPortal } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { LayoutType, GlobalState, GlobalStateContext } from '../../types';
import { withKey, withoutKey, includeItem, excludeItem } from '../../utils';

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

export function setLoading(this: GlobalStateContext, ctx: Atom<GlobalState>, loading: boolean) {
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
