import { prependItem, excludeOn, GlobalStateContext } from 'piral-core';
import { OpenNotification } from './types';

export function openNotification(ctx: GlobalStateContext, dialog: OpenNotification) {
  ctx.dispatch((state) => ({
    ...state,
    notifications: prependItem(state.notifications, dialog),
  }));
}

export function closeNotification(ctx: GlobalStateContext, dialog: OpenNotification) {
  ctx.dispatch((state) => ({
    ...state,
    notifications: excludeOn(state.notifications, (notification) => notification.id === dialog.id),
  }));
}
