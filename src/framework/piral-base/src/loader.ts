import { includeDependency, includeBundle } from './dependency';
import { loadUmdPilet } from './umd';
import { loadLegacyPilet } from './legacy';
import { loadSystemPilet } from './system';
import type { Pilet, PiletMetadata, DefaultLoaderConfig, PiletLoader, CustomSpecLoaders } from './types';

const inBrowser = typeof document !== 'undefined';

/**
 * Extends the default loader with the spec loaders, if any are given.
 * @param fallback The loader to use if none of the spec loaders matches.
 * @param specLoaders The spec loaders to use.
 * @returns The loader.
 */
export function extendLoader(fallback: PiletLoader, specLoaders: CustomSpecLoaders | undefined): PiletLoader {
  if (typeof specLoaders === 'object' && specLoaders) {
    return (meta) => {
      if (typeof meta.spec === 'string') {
        const loaderOverride = specLoaders[meta.spec];

        if (typeof loaderOverride === 'function') {
          return loaderOverride(meta);
        }
      }

      return fallback(meta);
    };
  }

  return fallback;
}

/**
 * Gets the default loader provided by piral-base.
 * @param config The loader configuration.
 * @returns The function to load a pilet from metadata.
 */
export function getDefaultLoader(config: DefaultLoaderConfig = {}) {
  return (meta: PiletMetadata): Promise<Pilet> => {
    if (inBrowser && 'link' in meta && meta.spec === 'v2') {
      return loadSystemPilet(meta);
    } else if (inBrowser && 'requireRef' in meta && meta.spec !== 'v2') {
      return loadUmdPilet(meta, config, includeDependency);
    } else if (inBrowser && 'bundle' in meta && meta.bundle) {
      return loadUmdPilet(meta, config, includeBundle);
    } else {
      return loadLegacyPilet(meta);
    }
  };
}
