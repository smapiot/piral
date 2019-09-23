import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { wrapElement } from 'react-arbiter';
import { Extend } from 'piral-core';
import { PiletNotificationsApi } from './types';

/**
 * Creates a new set of Piral API extensions for showing notifications.
 */
export function createNotificationsApi(): Extend<PiletNotificationsApi> {
  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      notifications: [],
    }));

    return {
      showNotification(content, options = {}) {
        const notification = {
          id: `${~~(Math.random() * 10000)}`,
          content: wrapElement(content),
          options,
          close() {
            context.closeNotification(notification);
          },
        };
        context.openNotification(notification);

        if (typeof options.autoClose === 'number' && options.autoClose > 0) {
          setTimeout(notification.close, options.autoClose);
        }

        return notification.close;
      },
    };
  };
}
