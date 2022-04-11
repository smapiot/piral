import type { Localizable } from 'piral-translate';
import type { DashboardConfig } from 'piral-dashboard';
import type { MenuConfig } from 'piral-menu';
import type { NotificationsConfig } from 'piral-notifications';
import type { ModalsConfig } from 'piral-modals';
import type { FeedsConfig } from 'piral-feeds';

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
