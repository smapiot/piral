import { setBasePath, registerModule, emptyApp, createEvaluatedPilet } from '../../utils';
import type { DefaultLoaderConfig, PiletMetadataV2, Pilet } from '../../types';

function extendSharedDependencies(deps: Record<string, string> | undefined) {
  if (deps) {
    for (const depName of Object.keys(deps)) {
      if (!System.has(depName)) {
        const depUrl = deps[depName];
        registerModule(depName, () => System.import(depUrl));
      }
    }
  }
}

/**
 * Loads the provided SystemJS-powered pilet.
 * @param meta The pilet's metadata.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(meta: PiletMetadataV2, _config: DefaultLoaderConfig): Promise<Pilet> {
  const link = setBasePath(meta, meta.link);
  extendSharedDependencies(meta.dependencies);

  return System.import(link)
    .catch((error) => {
      console.error('Failed to load SystemJS module', link, error);
      return emptyApp;
    })
    .then((app) => createEvaluatedPilet(meta, app));
}
