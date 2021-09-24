import { includeBundle } from './dependency';
import { setBasePath, loadFrom } from '../../utils';
import type { DefaultLoaderConfig, PiletMetadataBundle } from '../../types';

/**
 * Loads the provided UMD-powered pilet.
 * @param meta The pilet's metadata.
 * @param config The configuration for loading the pilet.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(meta: PiletMetadataBundle, config: DefaultLoaderConfig) {
  setBasePath(meta, meta.link);
  return loadFrom(meta, () => includeBundle(meta, config.crossOrigin));
}
