import { promisify } from './helpers';
import { includeScriptDependency, emptyApp, createEvaluatedPilet } from './dependency';
import type { PiletApp, PiletMetadata } from '../types';

const depContext = {};

function loadSharedDependencies(sharedDependencies: Record<string, string> | undefined) {
  if (sharedDependencies && typeof sharedDependencies === 'object') {
    const sharedDependencyNames = Object.keys(sharedDependencies);

    return Promise.all(
      sharedDependencyNames.map((name) => {
        return depContext[name] || (depContext[name] = includeScriptDependency(sharedDependencies[name]));
      }),
    );
  }

  return promisify();
}

/**
 * Loads a pilet from the specified metadata and loader function.
 * @param meta The metadata of the pilet.
 * @param loadPilet The loader function derived for the pilet.
 * @returns The evaluated pilet, which can then be integrated.
 */
export function loadFrom(meta: PiletMetadata, loadPilet: () => PiletApp | Promise<PiletApp>) {
  return loadSharedDependencies(meta.dependencies)
    .then(loadPilet)
    .catch((error) => {
      console.error('Failed to load pilet', meta.name, error);
      return emptyApp;
    })
    .then((app) => createEvaluatedPilet(meta, app));
}
