import { emptyApp, promisify } from '../../utils';
import type { DefaultLoaderConfig, PiletEntry, Pilet } from '../../types';

/**
 * Loads an empty pilet as a placeholder (something went wrong beforehand).
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletEntry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { name, spec = 'vx', ...rest } = entry;
  const dependencies = 'dependencies' in entry ? entry.dependencies : {};
  const meta = {
    name,
    version: '',
    spec,
    dependencies,
    config: {},
    link: '',
    basePath: '',
    ...rest,
  };

  console.warn('Empty pilet found!', name);
  return promisify({ ...meta, ...emptyApp });
}
