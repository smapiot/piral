import { Extend, createInstance, PiralConfiguration } from 'piral-core';
import {
  createFetchApi,
  createGqlApi,
  createLocaleApi,
  createDashboardApi,
  createMenuApi,
  createNotificationsApi,
  createModalsApi,
  createFeedsApi,
  setupGqlClient,
  setupLocalizer,
} from 'piral-ext';
import { PiralExtSettings } from './types';

/**
 * Extends the standard Piral API with custom API and settings.
 * @param settings Customizes the standard extension settings.
 * @param customApis The custom APIs to add.
 */
export function extendPiralApi(settings: PiralExtSettings = {}, customApis: Extend | Array<Extend> = []) {
  const extenders = Array.isArray(customApis) ? customApis : [customApis];
  return [
    ...extenders,
    createFetchApi(settings.fetch),
    createGqlApi(setupGqlClient(settings.gql)),
    createLocaleApi(setupLocalizer(settings.locale)),
    createDashboardApi(settings.dashboard),
    createMenuApi(settings.menu),
    createNotificationsApi(settings.notifications),
    createModalsApi(settings.modals),
    createFeedsApi(settings.feeds),
  ];
}

/**
 * Creates a standard Piral instance.
 * @param config The config for creating the piral state.
 * @param settings Customizes the standard extension settings.
 * @param customApis The custom APIs to add.
 */
export function createPiral(
  config: PiralConfiguration = {},
  settings?: PiralExtSettings,
  customApis?: Extend | Array<Extend>,
) {
  return createInstance({
    ...config,
    extendApi: extendPiralApi(settings, customApis),
  });
}
