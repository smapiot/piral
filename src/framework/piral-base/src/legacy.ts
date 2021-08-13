import { loadFrom } from './load';
import { fetchDependency } from './fetch';
import { createEmptyModule, setBasePath } from './utils';
import { compileDependency } from './dependency';
import type { PiletMetadata } from './types';

/**
 * Loads a legacy (v0) or invalid pilet.
 * @param meta The metadata of the pilet.
 * @returns The evaluated pilet that can now be integrated.
 */
export function loadLegacyPilet(meta: PiletMetadata) {
  const name = meta.name;

  if ('link' in meta && meta.link) {
    const link = setBasePath(meta, meta.link);
    return fetchDependency(link).then((content) => loadFrom(meta, () => compileDependency(name, content, link)));
  } else if ('content' in meta && meta.content) {
    const content = meta.content;
    return loadFrom(meta, () => compileDependency(name, content, undefined));
  } else {
    console.warn('Empty pilet found!', name);
  }

  return Promise.resolve(createEmptyModule(meta));
}
