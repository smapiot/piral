import { fetchDependency } from './fetch';
import { evalDependency } from './dependency';
import { loadFrom, setBasePath } from '../../utils';
import type { DefaultLoaderConfig, PiletMetadataV0, Pilet } from '../../types';

/**
 * Loads a legacy (v0) or invalid pilet.
 * @param meta The metadata of the pilet.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(meta: PiletMetadataV0, _config: DefaultLoaderConfig): Promise<Pilet> {
  const name = meta.name;

  if ('link' in meta && meta.link) {
    const link = setBasePath(meta, meta.link);
    return fetchDependency(link).then((content) => loadFrom(meta, () => evalDependency(name, content, link)));
  } else if ('content' in meta && meta.content) {
    const content = meta.content;
    return loadFrom(meta, () => evalDependency(name, content, undefined));
  } else {
    return loadFrom(meta, () => evalDependency(name, '', undefined));
  }
}
