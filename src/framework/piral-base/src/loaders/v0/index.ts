import { fetchDependency } from './fetch';
import { evalDependency } from './dependency';
import { loadFrom } from '../../utils';
import type { DefaultLoaderConfig, PiletV0Entry, Pilet } from '../../types';

/**
 * Loads a legacy (v0) or invalid pilet.
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletV0Entry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { name, config = {}, dependencies = {}, spec = 'v0' } = entry;
  const meta = {
    name,
    config,
    dependencies,
    spec,
    link: '',
    ...entry,
  };

  if ('link' in entry && entry.link) {
    return loadFrom(meta, () =>
      fetchDependency(entry.link).then((content) => evalDependency(name, content, entry.link)),
    );
  } else {
    const content = ('content' in entry && entry.content) || '';
    return loadFrom(meta, () => evalDependency(name, content, undefined));
  }
}
