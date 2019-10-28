import { PiralConfiguration, ComponentsState, ErrorComponentsState } from 'piral-core';
import {
  FetchConfig,
  DashboardConfig,
  MenuConfig,
  NotificationsConfig,
  ModalsConfig,
  FeedsConfig,
  Localizable,
  UrqlClient,
} from 'piral-ext';

export interface PiralExtSettings {
  /**
   * Customizes the fetch config.
   */
  fetch?: FetchConfig;
  /**
   * Customizes the gql config.
   */
  gql?: UrqlClient;
  /**
   * Customizes the locale config.
   */
  locale?: Localizable;
  /**
   * Customizes the dashboard config.
   */
  dashboard?: DashboardConfig;
  /**
   * Customizes the menu config.
   */
  menu?: MenuConfig;
  /**
   * Customizes the notifications config.
   */
  notifications?: NotificationsConfig;
  /**
   * Customizes the modals config.
   */
  modals?: ModalsConfig;
  /**
   * Customizes the feeds config.
   */
  feeds?: FeedsConfig;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralRenderOptions extends PiralConfiguration {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Customizes the extension settings.
   */
  settings?: PiralExtSettings;
  /**
   * Defines how the layout looks like.
   */
  layout?: Partial<ComponentsState>;
  /**
   * Defines how the errors looks like.
   */
  errors?: Partial<ErrorComponentsState>;
}
