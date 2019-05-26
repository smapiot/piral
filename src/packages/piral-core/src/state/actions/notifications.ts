import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, OpenNotification } from '../../types';
import { prependItem, excludeItem } from '../../utils';

export function openNotification(dialog: OpenNotification) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      notifications: prependItem(state.app.notifications, dialog),
    },
  }));
}

export function closeNotification(dialog: OpenNotification) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    app: {
      ...state.app,
      notifications: excludeItem(state.app.notifications, dialog),
    },
  }));
}
