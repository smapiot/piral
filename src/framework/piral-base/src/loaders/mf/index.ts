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
const systemRegistry = (System as any).registerRegistry as Record<string, unknown>;
const sharedScope = { current: undefined as MfScope | undefined };

function populateKnownDependencies(scope: MfScope) {
  // SystemJS to MF
  for (const entry of Object.keys(systemRegistry)) {
    const index = entry.lastIndexOf('@');

    if (index > 0 && !entry.match(/^https?:\/\//)) {
      const entryName = entry.substring(0, index);
      const entryVersion = entry.substring(index + 1);

      scope[entryName] ??= {};
      scope[entryName][entryVersion] ??= {
        from: appShell,
        eager: false,
        loaded: 1,
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
      const entryKey = `${entryName}@${entryVersion}`;

      if (entry.from !== appShell && !(entryKey in systemRegistry)) {
        registerModule(entryKey, () => entry.get().then((factory) => factory()));
      }

      // Flagging the scope entry as loaded ensures that subsequent pilets do not
      // overwrite an entry already registered by an earlier pilet.
      // We want to avoid overwrites to ensure stability.
      //
      // Inside a pilet bundled with the MF format, the corresponding scope
      // registration flow is equivalent to:
      //   if (!activeVersion || (!activeVersion.loaded && !hasEagerPrecedence)) {
      //     writeDependencyToScope();
      //   }
      //
      // -> By setting loaded to 1, we ensure that already registered entries are not overwritten.
      entry.loaded = 1;
    }
  }
}

function loadMfFactory(piletName: string, exposedName: string) {
  const varName = piletName.replace(/^@/, '').replace('/', '-').replace(/\-/g, '_');
  const container: MfContainer = window[varName];

  if (!sharedScope.current) {
    sharedScope.current = {};
    populateKnownDependencies(sharedScope.current);
  }

  container.init(sharedScope.current);
  extractSharedDependencies(sharedScope.current);
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
