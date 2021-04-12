import { withKey, withoutKey, prependItem, excludeOn, GlobalStateContext } from 'piral-core';
import { ModalRegistration, OpenModalDialog } from './types';

export function openModal(ctx: GlobalStateContext, dialog: OpenModalDialog) {
  ctx.dispatch((state) => ({
    ...state,
    modals: prependItem(state.modals, dialog),
  }));
}

export function closeModal(ctx: GlobalStateContext, dialog: OpenModalDialog) {
  ctx.dispatch((state) => ({
    ...state,
    modals: excludeOn(state.modals, (modal) => modal.id === dialog.id),
  }));
}

export function registerModal(ctx: GlobalStateContext, name: string, value: ModalRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      modals: withKey(state.registry.modals, name, value),
    },
  }));
}

export function unregisterModal(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      modals: withoutKey(state.registry.modals, name),
    },
  }));
}
