import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { TileRegistration } from './types';

export function registerTile(ctx: GlobalStateContext, name: string, value: TileRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      tiles: withKey(state.registry.tiles, name, value),
    },
  }));
}

export function unregisterTile(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      tiles: withoutKey(state.registry.tiles, name),
    },
  }));
}
