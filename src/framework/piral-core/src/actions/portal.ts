import { ReactPortal } from 'react';
import { withoutKey, withKey, includeItem, excludeItem, replaceOrAddItem } from '../utils';
import { GlobalStateContext } from '../types';

export function destroyPortal(ctx: GlobalStateContext, id: string) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withoutKey(state.portals, id),
  }));
}

export function hidePortal(ctx: GlobalStateContext, id: string, entry: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(state.portals, id, excludeItem(state.portals[id], entry)),
  }));
}

export function updatePortal(ctx: GlobalStateContext, id: string, current: ReactPortal, next: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(
      state.portals,
      id,
      replaceOrAddItem(state.portals[id], next, (m) => m === current),
    ),
  }));
}

export function showPortal(ctx: GlobalStateContext, id: string, entry: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(state.portals, id, includeItem(state.portals[id], entry)),
  }));
}
