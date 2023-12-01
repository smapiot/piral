import { createEvaluatedPilet, includeScriptDependency, registerModule } from '../../utils';
import type { DefaultLoaderConfig, PiletMfEntry, Pilet } from '../../types';

interface MfFactory {
  (): any;
}

interface MfScope {
  [depName: string]: {
    [depVersion: string]: {
      from: string;
      eager: boolean;
      loaded?: number;
      get(): Promise<MfFactory>;
    };
  };
}

interface MfContainer {
  init(scope: MfScope): void;
  get(path: string): Promise<MfFactory>;
}

const appShell = 'piral';

function populateKnownDependencies(scope: MfScope) {
  // SystemJS to MF
  for (const [entry] of System.entries()) {
    const index = entry.lastIndexOf('@');

    if (index > 0 && !entry.match(/^https?:\/\//)) {
      const entryName = entry.substring(0, index);
      const entryVersion = entry.substring(index + 1);

      if (!(entryName in scope)) {
        scope[entryName] = {};
      }

      scope[entryName][entryVersion] = {
        from: appShell,
        eager: false,
        get: () => System.import(entry).then((result) => () => result),
      };
    }
  }
}

function extractSharedDependencies(scope: MfScope) {
  // MF to SystemJS
  for (const entryName of Object.keys(scope)) {
    const entries = scope[entryName];

    for (const entryVersion of Object.keys(entries)) {
      const entry = entries[entryVersion];

      if (entry.from !== appShell) {
        registerModule(`${entryName}@${entryVersion}`, () => entry.get().then((factory) => factory()));
      }
    }
  }
}

function loadMfFactory(piletName: string, exposedName: string) {
  const varName = piletName.replace(/^@/, '').replace('/', '-').replace(/\-/g, '_');
  const container: MfContainer = window[varName];
  const scope: MfScope = {};
  container.init(scope);
  populateKnownDependencies(scope);
  extractSharedDependencies(scope);
  return container.get(exposedName);
}

/**
 * Loads the provided SystemJS-powered pilet.
 * @param entry The pilet's entry.
 * @param _config The loader configuration.
 * @returns The evaluated pilet that can now be integrated.
 */
export default function loader(entry: PiletMfEntry, _config: DefaultLoaderConfig): Promise<Pilet> {
  const { config = {}, name, link, ...rest } = entry;
  const dependencies = {};
  const exposedName = rest.custom?.exposed || './pilet';
  const meta = {
    name,
    dependencies,
    config,
    link,
    ...rest,
  };

  return includeScriptDependency(link)
    .then(() => loadMfFactory(name, exposedName))
    .then((factory) => createEvaluatedPilet(meta, factory()));
}
