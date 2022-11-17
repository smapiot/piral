import { includeDependency } from './dependency';
import { loadFrom } from '../../utils';
import type { DefaultLoaderConfig, PiletV1Entry, Pilet } from '../../types';

/**
 * Loads the provided UMD-powered pilet.
 * @param entry The pilet's entry.
 * @param config The configuration for loading the pilet.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV1Entry, config: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, spec = 'v1', ...rest } = entry;
  const meta = {
    dependencies,
    config: {},
    spec,
    ...rest,
  };

  return loadFrom(meta, () => includeDependency(entry, config.crossOrigin));
}
