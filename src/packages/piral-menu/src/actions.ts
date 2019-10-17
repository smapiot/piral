import { Atom, swap } from '@dbeining/react-atom';
import { GlobalState, withKey, withoutKey } from 'piral-core';
import { MenuItemRegistration } from './types';

export function registerMenuItem(ctx: Atom<GlobalState>, name: string, value: MenuItemRegistration) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      menuItems: withKey(state.registry.menuItems, name, value),
    },
  }));
}

export function unregisterMenuItem(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      menuItems: withoutKey(state.registry.menuItems, name),
    },
  }));
}
