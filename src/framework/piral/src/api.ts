import { PiralPlugin, createInstance, PiralConfiguration } from 'piral-core';
import { createStandardApi, PiralExtSettings } from 'piral-ext';

/**
 * Extends the standard Pilet API with custom API and settings.
 * @param settings Customizes the standard plugin settings.
 * @param customApis The custom APIs to add.
 * @deprecated Use `[...customApis, createStandardApi(settings)`] instead.
 */
export function extendPiralApi(settings: PiralExtSettings = {}, customApis: PiralPlugin | Array<PiralPlugin> = []) {
  const extenders = Array.isArray(customApis) ? customApis : [customApis];
  return [...extenders, ...createStandardApi(settings)];
}

/**
 * Creates a standard Piral instance.
 * @param config The config for creating the piral state.
 * @param settings Customizes the standard plugin settings.
 * @deprecated Use `createInstance` instead.
 */
export function createPiral(config: PiralConfiguration = {}, settings?: PiralExtSettings) {
  return createInstance({
    ...config,
    plugins: extendPiralApi(settings, config.plugins),
  });
}
