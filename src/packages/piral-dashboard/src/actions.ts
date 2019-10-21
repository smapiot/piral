import { Atom, swap } from '@dbeining/react-atom';
import { GlobalState, withKey, withoutKey } from 'piral-core';
import { TileRegistration } from './types';

export function registerTile(ctx: Atom<GlobalState>, name: string, value: TileRegistration) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      tiles: withKey(state.registry.tiles, name, value),
    },
  }));
}

export function unregisterTile(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      tiles: withoutKey(state.registry.tiles, name),
    },
  }));
}
