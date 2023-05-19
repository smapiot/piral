import * as actions from './actions';
import { ComponentType, isValidElement, ReactElement } from 'react';
import {
  PiralPlugin,
  GlobalStateContext,
  withApi,
  defaultRender,
  withAll,
  withRootExtension,
  GlobalState,
} from 'piral-core';
import { DefaultHost, DefaultToast } from './default';
import { Notifications } from './Notifications';
import { PiletNotificationsApi, NotificationOptions, OpenNotification, BareNotificationProps } from './types';

export type NotificationContent = string | ReactElement<any> | ComponentType<BareNotificationProps>;

export interface InitialNotification {
  /**
   * The content of the notification.
   */
  content: NotificationContent;
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

function isElement(element: any): element is ReactElement<any, any> {
  return isValidElement(element);
}

function toComponent(component: NotificationContent): ComponentType<BareNotificationProps> {
  if (typeof component === 'string') {
    const text = component;
    return () => defaultRender(text);
  } else if (isValidElement<any>(component)) {
    const element = component;
    return () => element;
  }

  return component;
}

function createNotification(
  context: GlobalStateContext,
  id: string,
  content: NotificationContent,
  defaultOptions: NotificationOptions,
  customOptions: NotificationOptions = {},
) {
  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  const notification: OpenNotification = {
    id,
    component: toComponent(content),
    options,
    close() {
      setTimeout(() => context.closeNotification(notification), 0);
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

function withNotifications(notifications: Array<OpenNotification>) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    components: {
      NotificationsHost: DefaultHost,
      NotificationsToast: DefaultToast,
      ...state.components,
    },
    notifications,
  });
}

/**
 * Creates new Pilet API extensions for showing notifications.
 */
export function createNotificationsApi(config: NotificationsConfig = {}): PiralPlugin<PiletNotificationsApi> {
  const { defaultOptions = {}, selectId = () => `${~~(Math.random() * 10000)}`, messages = [] } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch(
      withAll(
        withNotifications(getNotifications(context, messages, defaultOptions)),
        withRootExtension('piral-notifications', Notifications),
      ),
    );

    return (api) => ({
      showNotification(content, customOptions) {
        const Component =
          typeof content === 'string'
            ? content
            : isElement(content)
            ? content
            : withApi(context, content, api, 'extension');
        const notification = createNotification(context, selectId(), Component, defaultOptions, customOptions);
        context.openNotification(notification);
        return notification.close;
      },
    });
  };
}
