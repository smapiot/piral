import { PiralConfiguration, ComponentsState } from 'piral-core';
import {
  FetchConfig,
  GqlConfig,
  LocaleConfig,
  AuthConfig,
  DashboardConfig,
  MenuConfig,
  NotificationsConfig,
  ModalsConfig,
  ContainerConfig,
  FeedsConfig,
  FormsConfig,
  SearchConfig,
} from 'piral-ext';

export interface PiralExtSettings {
  /**
   * Customizes the fetch config.
   */
  fetch?: FetchConfig;
  /**
   * Customizes the gql config.
   */
  gql?: GqlConfig;
  /**
   * Customizes the locale config.
   */
  locale?: LocaleConfig;
  /**
   * Customizes the auth config.
   */
  auth?: AuthConfig;
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
   * Customizes the container config.
   */
  container?: ContainerConfig;
  /**
   * Customizes the feeds config.
   */
  feeds?: FeedsConfig;
  /**
   * Customizes the forms config.
   */
  forms?: FormsConfig;
  /**
   * Customizes the search config.
   */
  search?: SearchConfig;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions extends PiralConfiguration {
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
}
