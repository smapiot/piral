import loadBundle from './loaders/bundle';
import loadV0 from './loaders/v0';
import loadV1 from './loaders/v1';
import loadV2 from './loaders/v2';
import { createEmptyModule, isfunc } from './utils';
import type {
  PiletMetadata,
  Pilet,
  DefaultLoaderConfig,
  PiletLoader,
  CustomSpecLoaders,
  PiletMetadataV0,
  PiletMetadataV1,
  PiletMetadataV2,
  PiletMetadataBundle,
} from './types';

type InspectPiletV0 = ['v0', PiletMetadataV0];

type InspectPiletV1 = ['v1', PiletMetadataV1];

type InspectPiletV2 = ['v2', PiletMetadataV2];

type InspectPiletBundle = ['bundle', PiletMetadataBundle];

type InspectPiletUnknown = ['unknown', PiletMetadata];

type InspectPiletResult = InspectPiletV0 | InspectPiletV1 | InspectPiletV2 | InspectPiletUnknown | InspectPiletBundle;

function inspectPilet(meta: PiletMetadata): InspectPiletResult {
  const inBrowser = typeof document !== 'undefined';

  if (inBrowser && 'link' in meta && meta.spec === 'v2') {
    return ['v2', meta];
  } else if (inBrowser && 'requireRef' in meta && meta.spec !== 'v2') {
    return ['v1', meta];
  } else if (inBrowser && 'bundle' in meta && meta.bundle) {
    return ['bundle', meta];
  } else if ('hash' in meta) {
    return ['v0', meta];
  } else {
    return ['unknown', meta];
  }
}

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
 * @returns The function to load a pilet from metadata.
 */
export function getDefaultLoader(config: DefaultLoaderConfig = {}) {
  return (result: PiletMetadata): Promise<Pilet> => {
    const r = inspectPilet(result);

    switch (r[0]) {
      case 'v2':
        return loadV2(r[1], config);
      case 'v1':
        return loadV1(r[1], config);
      case 'v0':
        return loadV0(r[1], config);
      case 'bundle':
        return loadBundle(r[1], config);
      default:
        console.warn('Empty pilet found!', r[1].name);
        return Promise.resolve(createEmptyModule(r[1]));
    }
  };
}
