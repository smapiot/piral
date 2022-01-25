import { emptyApp, promisify } from '../../utils';
import type { DefaultLoaderConfig, PiletMetadata, Pilet } from '../../types';

/**
 * Loads an empty pilet as a placeholder (something went wrong beforehand).
 * @param meta The pilet's metadata.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(meta: PiletMetadata, _config: DefaultLoaderConfig): Promise<Pilet> {
  console.warn('Empty pilet found!', meta.name);
  return promisify({
    ...meta,
    ...emptyApp,
  });
}
