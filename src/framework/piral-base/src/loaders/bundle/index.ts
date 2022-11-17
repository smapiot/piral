import { includeBundle } from './dependency';
import { loadFrom } from '../../utils';
import type { DefaultLoaderConfig, PiletBundleEntry, Pilet } from '../../types';

/**
 * Loads the provided UMD-powered pilet.
 * @param entry The pilet's entry.
 * @param config The configuration for loading the pilet.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletBundleEntry, config: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, spec = 'v1', name = `[bundle] ${entry.link}`, ...rest } = entry;
  const meta = {
    name,
    version: '',
    config: {},
    spec,
    dependencies,
    ...rest,
  };
  return loadFrom(meta, () => includeBundle(entry, config.crossOrigin));
}
