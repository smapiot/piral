import { createLocaleApi } from 'piral-translate';
import { createDashboardApi } from 'piral-dashboard';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import { createModalsApi } from 'piral-modals';
import { createFeedsApi } from 'piral-feeds';
import { PiralExtSettings } from './types';

/**
 * Creates an array including all standard APIs from piral-ext.
 * @param settings Customizes the standard plugin settings.
 */
export function createStandardApi(settings: PiralExtSettings = {}) {
  const {
    locale = undefined,
    dashboard = undefined,
    menu = undefined,
    notifications = undefined,
    modals = undefined,
    feeds = undefined,
  } = settings;

  return [
    locale !== false && createLocaleApi(locale),
    dashboard !== false && createDashboardApi(dashboard),
    menu !== false && createMenuApi(menu),
    notifications !== false && createNotificationsApi(notifications),
    modals !== false && createModalsApi(modals),
    feeds !== false && createFeedsApi(feeds),
  ].filter(Boolean);
}
