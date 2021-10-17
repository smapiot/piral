import { loadFrom } from './load';
import { setBasePath } from './utils';
import type { PiletApp, PiletUmdMetadata } from './types';

/**
 * Loads the provided UMD-powered pilet.
 * @param meta The pilet's metadata.
 * @param config The configuration for loading the pilet.
 * @param loader The associated loader, either for bundle or single mode.
 */
export function loadUmdPilet<T extends PiletUmdMetadata>(
  meta: T,
  config: { crossOrigin?: string },
  loader: (meta: T, crossOrigin?: string) => Promise<PiletApp>,
) {
  setBasePath(meta, meta.link);
  return loadFrom(meta, () => loader(meta, config.crossOrigin));
}
