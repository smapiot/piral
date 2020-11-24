import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { BreadcrumbRegistration } from './types';

export function registerBreadcrumb(ctx: GlobalStateContext, name: string, value: BreadcrumbRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      breadcrumbs: withKey(state.registry.breadcrumbs, name, value),
    },
  }));
}

export function unregisterBreadcrumb(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      breadcrumbs: withoutKey(state.registry.breadcrumbs, name),
    },
  }));
}
