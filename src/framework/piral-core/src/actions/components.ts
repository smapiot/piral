import { appendItem, excludeOn, withKey, withoutKey } from '../utils';
import { PageRegistration, ExtensionRegistration, GlobalStateContext } from '../types';

export function registerPage(ctx: GlobalStateContext, name: string, value: PageRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withKey(state.registry.pages, name, value),
    },
  }));
}

export function unregisterPage(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withoutKey(state.registry.pages, name),
    },
  }));
}

export function registerExtension(ctx: GlobalStateContext, name: string, value: ExtensionRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(state.registry.extensions, name, appendItem(state.registry.extensions[name], value)),
    },
  }));
}

export function unregisterExtension(ctx: GlobalStateContext, name: string, reference: any) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(
        state.registry.extensions,
        name,
        excludeOn(state.registry.extensions[name], (m) => m.reference === reference),
      ),
    },
  }));
}
