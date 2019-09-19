import { wrapElement } from 'react-arbiter';
import { PiletApi, PiletMetadata, GlobalStateContext } from 'piral-core';
import { PiletNotificationsApi } from './types';

export function createNotificationsApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletNotificationsApi {
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
}
