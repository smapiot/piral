import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { MenuItemRegistration } from './types';

export function registerMenuItem(ctx: GlobalStateContext, name: string, value: MenuItemRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      menuItems: withKey(state.registry.menuItems, name, value),
    },
  }));
}

export function unregisterMenuItem(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      menuItems: withoutKey(state.registry.menuItems, name),
    },
  }));
}
