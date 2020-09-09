import type { PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createDependencyLoader } from './dependencies';
import type { PiletBlazorApi } from './types';

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
    context.converters.blazor = ({ moduleName, args, dependency }) => convert(moduleName, dependency, args);

    return () => {
      const loader = createDependencyLoader(convert, lazy);

      return {
        defineBlazorReferences: loader.defineBlazorReferences,
        fromBlazor(moduleName, args) {
          return {
            type: 'blazor',
            dependency: loader.getDependency(),
            moduleName,
            args,
          };
        },
      };
    };
  };
}
