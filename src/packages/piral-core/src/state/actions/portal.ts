import { ReactPortal } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { withoutKey, includeItem, withKey } from '../../utils';
import { GlobalState } from '../../types';

export function destroyPortal(ctx: Atom<GlobalState>, id: string) {
  swap(ctx, state => ({
    ...state,
    portals: withoutKey(state.portals, id),
  }));
}

export function showPortal(ctx: Atom<GlobalState>, id: string, entry: ReactPortal) {
  swap(ctx, state => ({
    ...state,
    portals: withKey(state.portals, id, includeItem(state.portals[id], entry)),
  }));
}
