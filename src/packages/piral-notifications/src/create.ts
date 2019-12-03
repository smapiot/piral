import * as actions from './actions';
import { ReactNode } from 'react';
import { swap } from '@dbeining/react-atom';
import { wrapElement } from 'react-arbiter';
import { Extend, GlobalStateContext } from 'piral-core';
import { DefaultHost, DefaultToast } from './default';
import { PiletNotificationsApi, NotificationOptions, OpenNotification } from './types';

export interface InitialNotification {
  /**
   * The content of the notification.
   */
  content: ReactNode | HTMLElement;
  /**
   * The optional options for the notification.
   */
  options?: NotificationOptions;
}

/**
 * Available configuration options for the notifications plugin.
 */
export interface NotificationsConfig {
  /**
   * Describes the default notification options to use.
   * @default {}
   */
  defaultOptions?: NotificationOptions;
  /**
   * Defines how the next ID for the key is selected.
   * By default a random number is used.
   */
  selectId?(): string;
  /**
   * Sets the initial notifications.
   * @default []
   */
  messages?: Array<InitialNotification>;
}

function createNotification(
  context: GlobalStateContext,
  id: string,
  content: ReactNode | HTMLElement,
  defaultOptions: NotificationOptions,
  customOptions: NotificationOptions = {},
) {
  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  const notification = {
    id,
    content: wrapElement(content),
    options,
    close() {
      context.closeNotification(notification);
    },
  };

  if (typeof options.autoClose === 'number' && options.autoClose > 0) {
    setTimeout(notification.close, options.autoClose);
  }

  return notification;
}

function getNotifications(
  context: GlobalStateContext,
  messages: Array<InitialNotification>,
  defaultOptions: NotificationOptions,
) {
  const notifications: Array<OpenNotification> = [];
  let i = 0;

  for (const { content, options } of messages) {
    notifications.push(createNotification(context, `global-${i++}`, content, defaultOptions, options));
  }

  return notifications;
}

/**
 * Creates new Pilet API extensions for showing notifications.
 */
export function createNotificationsApi(config: NotificationsConfig = {}): Extend<PiletNotificationsApi> {
  const { defaultOptions = {}, selectId = () => `${~~(Math.random() * 10000)}`, messages = [] } = config;

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        NotificationsHost: DefaultHost,
        NotificationsToast: DefaultToast,
      },
      notifications: getNotifications(context, messages, defaultOptions),
    }));

    return {
      showNotification(content, customOptions) {
        const notification = createNotification(context, selectId(), content, defaultOptions, customOptions);
        context.openNotification(notification);
        return notification.close;
      },
    };
  };
}
