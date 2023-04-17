import { registerDependencyUrls, loadSystemPilet, createEvaluatedPilet } from '../../utils';
import type { DefaultLoaderConfig, PiletV3Entry, Pilet } from '../../types';

/**
 * Loads the provided SystemJS-powered pilet.
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV3Entry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, config = {}, link, ...rest } = entry;
  const meta = {
    dependencies,
    config,
    link,
    ...rest,
  };

  registerDependencyUrls(dependencies);

  return loadSystemPilet(link).then((app) => createEvaluatedPilet(meta, app));
}
