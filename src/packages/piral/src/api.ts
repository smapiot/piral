import { Extend, createInstance, PiralConfiguration } from 'piral-core';
import { createStandardApi, PiralExtSettings } from 'piral-ext';

/**
 * Extends the standard Piral API with custom API and settings.
 * @param settings Customizes the standard extension settings.
 * @param customApis The custom APIs to add.
 */
export function extendPiralApi(settings: PiralExtSettings = {}, customApis: Extend | Array<Extend> = []) {
  const extenders = Array.isArray(customApis) ? customApis : [customApis];
  return [...extenders, ...createStandardApi(settings)];
}

/**
 * Creates a standard Piral instance.
 * @param config The config for creating the piral state.
 * @param settings Customizes the standard extension settings.
 */
export function createPiral(config: PiralConfiguration = {}, settings?: PiralExtSettings) {
  return createInstance({
    ...config,
    extendApi: extendPiralApi(settings, config.extendApi),
  });
}
