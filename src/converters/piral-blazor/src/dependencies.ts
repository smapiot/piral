import type { PiletMetadata } from 'piral-core';
import { loadBlazorPilet, loadResource, loadResourceWithSymbol, unloadBlazorPilet, unloadResource } from './interop';
import type { createConverter } from './converter';
import type { BlazorDependencyLoader, BlazorRootConfig } from './types';

const loadedDependencies = (window.$blazorDependencies ??= []);
const depsWithPrios = (window.$blazorDependencyPrios ??= []);

function toExtLessUrl(url: string) {
  const idx = url.lastIndexOf('.');
  const sep = url.lastIndexOf('/');

  if (idx > sep) {
    return url.substring(0, idx);
  }

  return url;
}

function toPdb(url: string) {
  return `${toExtLessUrl(url)}.pdb`;
}

function toDepName(url: string) {
  const front = toExtLessUrl(url);
  const idx = front.lastIndexOf('/');

  if (idx >= 0) {
    return front.substring(idx + 1);
  }

  return front;
}

export function createDependencyLoader(convert: ReturnType<typeof createConverter>) {
  const definedBlazorReferences: Array<string> = [];
  const loadedBlazorPilets: Array<string> = [];
  let dependency: BlazorDependencyLoader;

  return {
    getDependency() {
      return dependency;
    },
    defineBlazorReferences(references: Array<string>, meta: Partial<PiletMetadata> = {}, satellites = {}, prio = 0, kind = 'local', sharedDependencies = []) {
      prio = Math.max(prio, 0);

      const depWithPrio = {
        prio,
        kind,
        load() {
          return Promise.resolve();
        },
      };

      let result: false | Promise<void> = false;
      const load = async ([_, capabilities]: BlazorRootConfig) => {
        // let others (any global, or higher prio) finish first
        await Promise.all(depsWithPrios.filter((m) => m.prio > prio || (kind !== m.kind && m.kind === 'global')).map((m) => m.load()));

        window.dispatchEvent(new CustomEvent('loading-blazor-pilet', { detail: meta }));

        if (capabilities.includes('load')) {
          // new loading mechanism

          if (!capabilities.includes('language')) {
            satellites = undefined;
          }

          const supportsCore = capabilities.includes('core-pilet');
          const dependencies = references.filter((m) => m.endsWith('.dll'));
          const dllUrl = dependencies.pop();
          const pdbUrl = toPdb(dllUrl);
          const dependencySymbols = dependencies.map(toPdb).filter(dep => references.includes(dep));
          const id = Math.random().toString(26).substring(2);

          if (supportsCore) {
            for (let i = dependencies.length; i--; ) {
              const name = toDepName(dependencies[i]);

              for (const dep of sharedDependencies) {
                // OK we want to share this one - remove it from the given dependencies
                if (name === dep) {
                  dependencies.splice(i, 1);
                  break;
                }
              }
            }
          }

          await loadBlazorPilet(id, {
            name: meta.name || '(unknown)',
            version: meta.version || '0.0.0',
            config: JSON.stringify(meta.config || {}),
            baseUrl: meta.basePath || dllUrl.substring(0, dllUrl.lastIndexOf('/')).replace('/_framework/', '/'),
            dependencies,
            dependencySymbols: capabilities.includes('dependency-symbols') ? dependencySymbols : undefined,
            sharedDependencies: supportsCore ? sharedDependencies : undefined,
            kind: supportsCore ? kind : undefined,
            satellites,
            dllUrl,
            pdbUrl: references.includes(pdbUrl) ? pdbUrl : undefined,
          });

          loadedBlazorPilets.push(id);
        } else {
          // old loading mechanism

          for (const dllUrl of references) {
            const dllName = dllUrl.substring(dllUrl.lastIndexOf('/') + 1);

            if (dllUrl.endsWith('.dll')) {
              const entry = loadedDependencies.find((m) => m.name === dllName);

              if (entry) {
                entry.count++;
                await entry.promise;
              } else {
                const urlWithoutExtension = dllUrl.substring(0, dllUrl.length - 4);
                const pdbName = `${urlWithoutExtension}.pdb`;
                const pdbUrl = references.find((m) => m === pdbName);
                const promise = pdbUrl ? loadResourceWithSymbol(dllUrl, pdbUrl) : loadResource(dllUrl);

                loadedDependencies.push({
                  name: dllName,
                  url: dllUrl,
                  count: 1,
                  promise,
                });

                await promise;
              }

              definedBlazorReferences.push(dllName);
            }
          }
        }

        // inform remaining that this one finished
        window.dispatchEvent(new CustomEvent('loaded-blazor-pilet', { detail: meta }));
      };

      const lazy = convert.lazy && kind !== 'global';

      depWithPrio.load = () => {
        if (!result) {
          result = !lazy ? convert.loader.then(load) : Promise.resolve();
        }

        return result;
      };
      result = !lazy && convert.loader.then(load);
      dependency = (config) => result || (result = load(config));

      if (prio) {
        depsWithPrios.push(depWithPrio);
      }
    },
    async releaseBlazorReferences() {
      const references = definedBlazorReferences.splice(0, definedBlazorReferences.length);
      const ids = loadedBlazorPilets.splice(0, loadedBlazorPilets.length);

      // old way of loading
      for (const reference of references) {
        const entry = loadedDependencies.find((m) => m.name === reference);

        if (--entry.count === 0) {
          loadedDependencies.splice(loadedDependencies.indexOf(entry), 1);
          await unloadResource(entry.url);
        }
      }

      // new way of loading
      for (const id of ids) {
        await unloadBlazorPilet(id);
      }
    },
  };
}
