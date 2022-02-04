import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import type { PageLayoutRegistration } from './types';

export function registerPageLayout(ctx: GlobalStateContext, name: string, value: PageLayoutRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      pageLayouts: withKey(state.registry.pageLayouts, name, value),
    },
  }));
}

export function unregisterPageLayout(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      pageLayouts: withoutKey(state.registry.pageLayouts, name),
    },
  }));
}
