import { Atom, swap } from '@dbeining/react-atom';
import { GlobalState, withKey, withoutKey } from 'piral-core';
import { TileRegistration } from './types';

export function registerTile(ctx: Atom<GlobalState>, name: string, value: TileRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withKey(state.components.tiles, name, value),
    },
  }));
}

export function unregisterTile(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withoutKey(state.components.tiles, name),
    },
  }));
}
