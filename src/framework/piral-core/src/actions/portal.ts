import { ReactPortal } from 'react';
import { withoutKey, includeItem, withKey } from '../utils';
import { GlobalStateContext } from '../types';

export function destroyPortal(ctx: GlobalStateContext, id: string) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withoutKey(state.portals, id),
  }));
}

export function showPortal(ctx: GlobalStateContext, id: string, entry: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(state.portals, id, includeItem(state.portals[id], entry)),
  }));
}
