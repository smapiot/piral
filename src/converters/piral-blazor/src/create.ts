import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createDependencyLoader } from './dependencies';
import type { BlazorOptions, PiletBlazorApi } from './types';

/**
 * Available configuration options for the Blazor plugin.
 */
export interface BlazorConfig {
  /**
   * Determines if Blazor should only be loaded on demand.
   * @default true
   */
  lazy?: boolean;
}

/**
 * Creates new Pilet API extensions for integration of Blazor.
 */
export function createBlazorApi(config: BlazorConfig = {}): PiralPlugin<PiletBlazorApi> {
  const { lazy } = config;

  return (context) => {
    const convert = createConverter(lazy);
    context.converters.blazor = ({ moduleName, args, dependency, options }) =>
      convert(moduleName, dependency, args, options);

    return () => {
      const loader = createDependencyLoader(convert, lazy);
      let options: BlazorOptions;

      return {
        defineBlazorReferences: loader.defineBlazorReferences,
        defineBlazorOptions(blazorOptions: BlazorOptions) {
          options = blazorOptions;
        },
        fromBlazor(moduleName, args) {
          return {
            type: 'blazor',
            dependency: loader.getDependency(),
            moduleName,
            args,
            options,
          };
        },
      };
    };
  };
}
