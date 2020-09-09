import type {} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletPwaApi {}

  interface PiralCustomState {}

  interface PiralCustomActions {}

  interface PiralCustomComponentsState {}

  interface PiralCustomRegistryState {}
}

export interface PiletPwaApi {
  /**
   * Shows a native notification.
   * @param title The title of the notification.
   * @param options The options for displaying the notification.
   */
  showAppNotification(title: string, options?: NotificationOptions): Promise<void>;
}

export interface PwaClient {
  /**
   * Uses the registered service worker, if available.
   * @param action The action to apply.
   */
  use(action: (reg: ServiceWorkerRegistration) => void): Promise<void>;
  /**
   * Forces an update of the PWA application.
   */
  update(): void;
}
