import { swap, Atom } from '@dbeining/react-atom';
import { appendItem, excludeOn, withKey, withoutKey } from '../../utils';
import { PageRegistration, ExtensionRegistration, GlobalState } from '../../types';

export function registerPage(ctx: Atom<GlobalState>, name: string, value: PageRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      pages: withKey(state.components.pages, name, value),
    },
  }));
}

export function unregisterPage(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      pages: withoutKey(state.components.pages, name),
    },
  }));
}

export function registerExtension(ctx: Atom<GlobalState>, name: string, value: ExtensionRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      extensions: withKey(state.components.extensions, name, appendItem(state.components.extensions[name], value)),
    },
  }));
}

export function unregisterExtension(ctx: Atom<GlobalState>, name: string, reference: any) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      extensions: withKey(
        state.components.extensions,
        name,
        excludeOn(state.components.extensions[name], m => m.reference === reference),
      ),
    },
  }));
}
