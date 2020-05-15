import { Extend } from 'piral-core';
import { addReference } from './internal';
import { createConverter } from './converter';
import { PiletBlazorApi } from './types';

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
export function createBlazorApi(config: BlazorConfig = {}): Extend<PiletBlazorApi> {
  const { lazy = true } = config;

  return context => {
    const convert = createConverter(lazy);
    context.converters.blazor = ({ moduleName, args, dependency }) => convert(moduleName, dependency, args);

    return () => {
      let dependency: () => Promise<any>;

      return {
        defineBlazorReferences(references) {
          const load = () =>
            Promise.all(
              references.map(reference =>
                fetch(reference)
                  .then(res => res.blob())
                  .then(addReference),
              ),
            );
          let result = !lazy && convert.loader.then(load);
          dependency = () => result || (result = load());
        },
        fromBlazor(moduleName, args) {
          return {
            type: 'blazor',
            dependency,
            moduleName,
            args,
          };
        },
      };
    };
  };
}
