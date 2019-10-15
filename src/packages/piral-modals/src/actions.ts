import { Atom, swap } from '@dbeining/react-atom';
import { GlobalState, withKey, withoutKey, prependItem, excludeItem } from 'piral-core';
import { ModalRegistration, OpenModalDialog } from './types';

export function openModal(ctx: Atom<GlobalState>, dialog: OpenModalDialog) {
  swap(ctx, state => ({
    ...state,
    modals: prependItem(state.modals, dialog),
  }));
}

export function closeModal(ctx: Atom<GlobalState>, dialog: OpenModalDialog) {
  swap(ctx, state => ({
    ...state,
    modals: excludeItem(state.modals, dialog),
  }));
}

export function registerModal(ctx: Atom<GlobalState>, name: string, value: ModalRegistration) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      modals: withKey(state.registry.modals, name, value),
    },
  }));
}

export function unregisterModal(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    registry: {
      ...state.registry,
      modals: withoutKey(state.registry.modals, name),
    },
  }));
}
