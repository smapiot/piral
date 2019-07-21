import { swap, Atom } from '@dbeining/react-atom';
import { appendItem, excludeOn, withKey, withoutKey } from '../../utils';
import {
  MenuItemRegistration,
  ModalRegistration,
  PageRegistration,
  TileRegistration,
  ExtensionRegistration,
  GlobalState,
  SearchProviderRegistration,
} from '../../types';

export function registerMenuItem(ctx: Atom<GlobalState>, name: string, value: MenuItemRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      menuItems: withKey(state.components.menuItems, name, value),
    },
  }));
}

export function unregisterMenuItem(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      menuItems: withoutKey(state.components.menuItems, name),
    },
  }));
}

export function registerModal(ctx: Atom<GlobalState>, name: string, value: ModalRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      modals: withKey(state.components.modals, name, value),
    },
  }));
}

export function unregisterModal(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      modals: withoutKey(state.components.modals, name),
    },
  }));
}

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

export function registerTile(ctx: Atom<GlobalState>, name: string, value: TileRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withKey(state.components.tiles, name, value),
    },
  }));
}

export function unregisterTile(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withoutKey(state.components.tiles, name),
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

export function registerSearchProvider(ctx: Atom<GlobalState>, name: string, value: SearchProviderRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      searchProviders: withKey(state.components.searchProviders, name, value),
    },
  }));
}

export function unregisterSearchProvider(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      searchProviders: withoutKey(state.components.searchProviders, name),
    },
  }));
}
