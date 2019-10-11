import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState, prependItem, excludeItem } from 'piral-core';
import { OpenNotification } from './types';

export function openNotification(ctx: Atom<GlobalState>, dialog: OpenNotification) {
  swap(ctx, state => ({
    ...state,
    notifications: prependItem(state.notifications, dialog),
  }));
}

export function closeNotification(ctx: Atom<GlobalState>, dialog: OpenNotification) {
  swap(ctx, state => ({
    ...state,
    notifications: excludeItem(state.notifications, dialog),
  }));
}
