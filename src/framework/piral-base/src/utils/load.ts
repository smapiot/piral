import { emptyApp } from './empty';
import { promisify } from './helpers';
import { includeScriptDependency, createEvaluatedPilet } from './dependency';
import type { PiletApp, PiletMetadata } from '../types';

const depContext = {};

function loadSharedDependencies(dependencies: Record<string, string>): Promise<any> {
  if (dependencies) {
    const names = Object.keys(dependencies);

    return Promise.all(
      names.map((name) => {
        return depContext[name] || (depContext[name] = includeScriptDependency(dependencies[name]));
      }),
    );
  }

  return promisify();
}

function handleFailure(error: Error, name: string) {
  console.error('Failed to load pilet', name, error);
  return emptyApp;
}

/**
 * Loads a pilet from the specified metadata and loader function.
 * @param meta The metadata of the pilet.
 * @param link The link (URL) to the pilet's main script.
 * @param loadPilet The loader function derived for the pilet.
 * @returns The evaluated pilet, which can then be integrated.
 */
export function loadFrom(meta: Omit<PiletMetadata, 'basePath'>, loadPilet: () => PiletApp | Promise<PiletApp>) {
  return loadSharedDependencies(meta.dependencies)
    .then(loadPilet)
    .catch((error) => handleFailure(error, meta.name))
    .then((app) => createEvaluatedPilet(meta, app));
}
