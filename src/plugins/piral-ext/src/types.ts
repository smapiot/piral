import { Localizable } from 'piral-translate';
import { DashboardConfig } from 'piral-dashboard';
import { MenuConfig } from 'piral-menu';
import { NotificationsConfig } from 'piral-notifications';
import { ModalsConfig } from 'piral-modals';
import { FeedsConfig } from 'piral-feeds';

export interface PiralExtSettings {
  /**
   * Customizes the locale config.
   */
  locale?: Localizable | false;
  /**
   * Customizes the dashboard config.
   */
  dashboard?: DashboardConfig | false;
  /**
   * Customizes the menu config.
   */
  menu?: MenuConfig | false;
  /**
   * Customizes the notifications config.
   */
  notifications?: NotificationsConfig | false;
  /**
   * Customizes the modals config.
   */
  modals?: ModalsConfig | false;
  /**
   * Customizes the feeds config.
   */
  feeds?: FeedsConfig | false;
}
