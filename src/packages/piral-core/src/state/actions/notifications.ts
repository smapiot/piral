import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, OpenNotification } from '../../types';
import { prependItem, excludeItem } from '../../utils';

export function openNotification(ctx: Atom<GlobalState>, dialog: OpenNotification) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      notifications: prependItem(state.app.notifications, dialog),
    },
  }));
}

export function closeNotification(ctx: Atom<GlobalState>, dialog: OpenNotification) {
  swap(ctx, state => ({
    ...state,
    app: {
      ...state.app,
      notifications: excludeItem(state.app.notifications, dialog),
    },
  }));
}
