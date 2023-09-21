import type { EventEmitter, PiralPlugin } from 'piral-core';
import { createConverter } from './converter';
import { createDependencyLoader } from './dependencies';
import type { BlazorLogLevel, BlazorOptions, PiletBlazorApi, WebAssemblyStartOptions } from './types';

/**
 * Available configuration options for the Blazor plugin.
 */
export interface BlazorConfig {
  /**
   * Determines if Blazor should only be loaded on demand.
   * @default true
   */
  lazy?: boolean;
  /**
   * Determines the used log level, if any. Otherwise, will use
   * the default log level (info).
   */
  logLevel?: BlazorLogLevel;
  /**
   * Determines the initial language to use, if any.
   * Otherwise, falls back to Blazor's default language.
   */
  initialLanguage?: string;
  /**
   * Installs a function to handle language change. By default,
   * this will hook on to the `select-language` event from Piral.
   * @param inform The callback to use for passing in a new locale.
   */
  onLanguageChange?: ((inform: (language: string) => void) => void) | false;
  /**
   * Determines the start options to use for booting Blazor.
   */
  options?: WebAssemblyStartOptions;
}

function createDefaultHandler(context: EventEmitter) {
  return (inform: (language: string) => void) => {
    context.on('select-language', (ev) => {
      inform(ev.currentLanguage);
    });
  };
}

/**
 * Creates new Pilet API extensions for integration of Blazor.
 */
export function createBlazorApi(config: BlazorConfig = {}): PiralPlugin<PiletBlazorApi> {
  return (context) => {
    const { lazy = true, initialLanguage, onLanguageChange = createDefaultHandler(context), logLevel } = config;
    const convert = createConverter(
      lazy,
      config.options,
      {
        current: initialLanguage,
        onChange: onLanguageChange || (() => {}),
      },
      logLevel,
    );
    context.converters.blazor = ({ moduleName, args, dependency, options }) =>
      convert(moduleName, dependency, args, options);

    return (_, meta) => {
      const loader = createDependencyLoader(convert);
      let options: BlazorOptions;

      return {
        defineBlazorReferences(references, satellites, prio, kind, sharedDependencies) {
          return loader.defineBlazorReferences(references, meta, satellites, prio, kind, sharedDependencies);
        },
        defineBlazorOptions(blazorOptions: BlazorOptions) {
          options = blazorOptions;
        },
        releaseBlazorReferences: loader.releaseBlazorReferences,
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
