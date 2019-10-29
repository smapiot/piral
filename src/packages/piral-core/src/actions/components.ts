import { swap, Atom } from '@dbeining/react-atom';
import { appendItem, excludeOn, withKey, withoutKey } from '../utils';
import { PageRegistration, ExtensionRegistration, GlobalState } from '../types';

export function registerPage(ctx: Atom<GlobalState>, name: string, value: PageRegistration) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withKey(state.registry.pages, name, value),
    },
  }));
}

export function unregisterPage(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withoutKey(state.registry.pages, name),
    },
  }));
}

export function registerExtension(ctx: Atom<GlobalState>, name: string, value: ExtensionRegistration) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(state.registry.extensions, name, appendItem(state.registry.extensions[name], value)),
    },
  }));
}

export function unregisterExtension(ctx: Atom<GlobalState>, name: string, reference: any) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(
        state.registry.extensions,
        name,
        excludeOn(state.registry.extensions[name], m => m.reference === reference),
      ),
    },
  }));
}
