import { FetchConfig } from 'piral-fetch';
import { UrqlClient } from 'piral-urql';
import { Localizable } from 'piral-translate';
import { DashboardConfig } from 'piral-dashboard';
import { MenuConfig } from 'piral-menu';
import { NotificationsConfig } from 'piral-notifications';
import { ModalsConfig } from 'piral-modals';
import { FeedsConfig } from 'piral-feeds';

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
