import type { ReactElement, ComponentType } from 'react';
import type { Disposable, BaseComponentProps, AnyComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNotificationsApi {}

  interface PiralCustomState {
    /**
     * The currently open notifications.
     */
    notifications: Array<OpenNotification>;
  }

  interface PiralCustomActions {
    /**
     * Opens the given notification.
     * @param notification The notification to show.
     */
    openNotification(notification: OpenNotification): void;
    /**
     * Closes the given notification.
     * @param notification The notification to hide.
     */
    closeNotification(notification: OpenNotification): void;
  }

  interface PiralCustomComponentsState {
    /**
     * The host component for notifications.
     */
    NotificationsHost: ComponentType<NotificationsHostProps>;
    /**
     * The notification toast component.
     */
    NotificationsToast: ComponentType<NotificationsToastProps>;
  }

  interface PiralCustomRegistryState {}
}

export interface NotificationsHostProps {}

export interface NotificationsToastProps extends BareNotificationProps {}

export interface PiralCustomNotificationOptions {}

export interface NotificationOptions extends PiralCustomNotificationOptions {
  /**
   * The title of the notification, if any.
   */
  title?: string;
  /**
   * Determines when the notification should automatically close in milliseconds.
   * A value of 0 or undefined forces the user to close the notification.
   */
  autoClose?: number;
  /**
   * The type of the notification used when displaying the message.
   * By default info is used.
   */
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface BareNotificationProps {
  /**
   * Callback for closing the notification programmatically.
   */
  onClose(): void;
  /**
   * Provides the passed in options for this particular notification.
   */
  options: NotificationOptions;
}

export type NotificationComponentProps = BaseComponentProps & BareNotificationProps;

export interface OpenNotification {
  id: string;
  component: ComponentType<BareNotificationProps>;
  options: NotificationOptions;
  close(): void;
}

export interface PiletNotificationsApi {
  /**
   * Shows a notification in the determined spot using the provided content.
   * @param content The content to display. Normally, a string would be sufficient.
   * @param options The options to consider for showing the notification.
   * @returns A callback to trigger closing the notification.
   */
  showNotification(
    content: string | ReactElement<any, any> | AnyComponent<NotificationComponentProps>,
    options?: NotificationOptions,
  ): Disposable;
}
