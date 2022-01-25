import { includeDependency } from './dependency';
import { setBasePath, loadFrom } from '../../utils';
import type { DefaultLoaderConfig, PiletMetadataV1, Pilet } from '../../types';

/**
 * Loads the provided UMD-powered pilet.
 * @param meta The pilet's metadata.
 * @param config The configuration for loading the pilet.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(meta: PiletMetadataV1, config: DefaultLoaderConfig): Promise<Pilet> {
  setBasePath(meta, meta.link);
  return loadFrom(meta, () => includeDependency(meta, config.crossOrigin));
}
