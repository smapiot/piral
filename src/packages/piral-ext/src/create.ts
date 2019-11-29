import { createLocaleApi } from 'piral-translate';
import { createDashboardApi } from 'piral-dashboard';
import { createMenuApi } from 'piral-menu';
import { createNotificationsApi } from 'piral-notifications';
import { createModalsApi } from 'piral-modals';
import { createFeedsApi } from 'piral-feeds';
import { PiralExtSettings } from './types';

/**
 * Creates an array including all standard APIs from piral-ext.
 * @param settings Customizes the standard extension settings.
 */
export function createStandardApi(settings: PiralExtSettings = {}) {
  return [
    createLocaleApi(settings.locale),
    createDashboardApi(settings.dashboard),
    createMenuApi(settings.menu),
    createNotificationsApi(settings.notifications),
    createModalsApi(settings.modals),
    createFeedsApi(settings.feeds),
  ];
}
