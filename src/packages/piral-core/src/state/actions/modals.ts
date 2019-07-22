import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, OpenModalDialog } from '../../types';
import { prependItem, excludeItem } from '../../utils';

export function openModal(ctx: Atom<GlobalState>, dialog: OpenModalDialog) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      modals: prependItem(state.app.modals, dialog),
    },
  }));
}

export function closeModal(ctx: Atom<GlobalState>, dialog: OpenModalDialog) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      modals: excludeItem(state.app.modals, dialog),
    },
  }));
}
