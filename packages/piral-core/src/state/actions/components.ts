import { swap, Atom } from '@dbeining/react-atom';
import { appendItem, excludeOn, withKey, withoutKey } from '../../utils';
import {
  MenuRegistration,
  ModalRegistration,
  PageRegistration,
  TileRegistration,
  ExtensionRegistration,
  GlobalState,
} from '../../types';

export function registerMenuItem(name: string, value: MenuRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      menuItems: withKey(state.components.menuItems, name, value),
    },
  }));
}

export function unregisterMenuItem(name: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      menuItems: withoutKey(state.components.menuItems, name),
    },
  }));
}

export function registerModal(name: string, value: ModalRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      modals: withKey(state.components.modals, name, value),
    },
  }));
}

export function unregisterModal(name: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      modals: withoutKey(state.components.modals, name),
    },
  }));
}

export function registerPage(name: string, value: PageRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      pages: withKey(state.components.pages, name, value),
    },
  }));
}

export function unregisterPage(name: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      pages: withoutKey(state.components.pages, name),
    },
  }));
}

export function registerTile(name: string, value: TileRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withKey(state.components.tiles, name, value),
    },
  }));
}

export function unregisterTile(name: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      tiles: withoutKey(state.components.tiles, name),
    },
  }));
}

export function registerExtension(name: string, value: ExtensionRegistration) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    components: {
      ...state.components,
      extensions: withKey(state.components.extensions, name, appendItem(state.components.extensions[name], value)),
    },
  }));
}

export function unregisterExtension(name: string, reference: any) {
  swap(this as Atom<GlobalState>, state => ({
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
