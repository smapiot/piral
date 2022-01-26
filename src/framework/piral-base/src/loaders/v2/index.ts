import { registerModule, emptyApp, createEvaluatedPilet } from '../../utils';
import type { DefaultLoaderConfig, PiletV2Entry, Pilet } from '../../types';

function extendSharedDependencies(dependencies: Record<string, string>) {
  for (const name of Object.keys(dependencies)) {
    if (!System.has(name)) {
      const dependency = dependencies[name];
      registerModule(name, () => System.import(dependency));
    }
  }
}

function handleFailure(error: Error, link: string) {
  console.error('Failed to load SystemJS module', link, error);
  return emptyApp;
}

/**
 * Loads the provided SystemJS-powered pilet.
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV2Entry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { dependencies = {}, config = {}, link, ...rest } = entry;
  const meta = {
    dependencies,
    config,
    link,
    ...rest,
  };

  extendSharedDependencies(dependencies);

  return System.import(link)
    .catch((error) => handleFailure(error, link))
    .then((app) => createEvaluatedPilet(meta, app));
}
