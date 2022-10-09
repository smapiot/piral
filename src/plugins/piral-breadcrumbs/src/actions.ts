import type { GlobalStateContext, Dict } from 'piral-core';
import { BreadcrumbRegistration } from './types';

export function registerBreadcrumbs(ctx: GlobalStateContext, values: Dict<BreadcrumbRegistration>) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      breadcrumbs: {
        ...state.registry.breadcrumbs,
        ...values,
      },
    },
  }));
}

export function unregisterBreadcrumbs(ctx: GlobalStateContext, names: Array<string>) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      breadcrumbs: names.reduce((prev, name) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      }, state.registry.breadcrumbs),
    },
  }));
}
