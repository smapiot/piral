import loadBundle from './loaders/bundle';
import loadEmpty from './loaders/empty';
import loadV0 from './loaders/v0';
import loadV1 from './loaders/v1';
import loadV2 from './loaders/v2';
import loadV3 from './loaders/v3';
import loadMf from './loaders/mf';
import { isfunc } from './utils';
import { inspectPilet } from './inspect';
import type { DefaultLoaderConfig, PiletLoader, CustomSpecLoaders } from './types';

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

        if (isfunc(loaderOverride)) {
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
 * @returns The function to load a pilet from its entry.
 */
export function getDefaultLoader(config: DefaultLoaderConfig = {}): PiletLoader {
  return (result) => {
    const r = inspectPilet(result);

    switch (r[0]) {
      case 'v3':
        return loadV3(r[1], config);
      case 'v2':
        return loadV2(r[1], config);
      case 'v1':
        return loadV1(r[1], config);
      case 'v0':
        return loadV0(r[1], config);
      case 'mf':
        return loadMf(r[1], config);
      case 'bundle':
        return loadBundle(r[1], config);
      default:
        return loadEmpty(r[1], config);
    }
  };
}
