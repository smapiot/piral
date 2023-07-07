import type { ReactElement, ComponentType, ReactNode } from 'react';
import type { Disposable, BaseComponentProps, AnyComponent, UnionOf } from 'piral-core';

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

export interface NotificationsHostProps {
  /**
   * The notifications to display.
   */
  children?: ReactNode;
}

export interface NotificationsToastProps extends BareNotificationProps {
  /**
   * The content of the toast to display.
   */
  children?: ReactNode;
}

export interface PiralCustomNotificationOptions {}

export interface PiralCustomNotificationTypes {}

export interface PiralNotificationTypes extends PiralCustomNotificationTypes {
  /**
   * The info type. No extra options.
   */
  info: {};
  /**
   * The success type. No extra options.
   */
  success: {};
  /**
   * The warning type. No extra options.
   */
  warning: {};
  /**
   * The error type. No extra options.
   */
  error: {};
}

export type PiralSpecificNotificationOptions = UnionOf<{
  [P in keyof PiralNotificationTypes]: Partial<PiralNotificationTypes[P]> & {
    /**
     * The type of the notification used when displaying the message.
     * By default info is used.
     */
    type?: P;
  };
}>;

export interface PiralStandardNotificationOptions {
  /**
   * The title of the notification, if any.
   */
  title?: string;
  /**
   * Determines when the notification should automatically close in milliseconds.
   * A value of 0 or undefined forces the user to close the notification.
   */
  autoClose?: number;
}

export type NotificationOptions = PiralCustomNotificationOptions &
  PiralStandardNotificationOptions &
  PiralSpecificNotificationOptions;

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
