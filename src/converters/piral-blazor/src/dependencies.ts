import type { PiletMetadata } from 'piral-core';
import { loadBlazorPilet, loadResource, loadResourceWithSymbol, unloadBlazorPilet, unloadResource } from './interop';
import type { createConverter } from './converter';
import type { BlazorDependencyLoader, BlazorRootConfig } from './types';

const loadedDependencies = (window.$blazorDependencies ??= []);
const depsWithPrios = (window.$blazorDependencyPrios ??= []);

export function createDependencyLoader(convert: ReturnType<typeof createConverter>, lazy: boolean) {
  const definedBlazorReferences: Array<string> = [];
  const loadedBlazorPilets: Array<string> = [];
  let dependency: BlazorDependencyLoader;

  return {
    getDependency() {
      return dependency;
    },
    defineBlazorReferences(references: Array<string>, meta: Partial<PiletMetadata> = {}, satellites = {}, prio = 0) {
      prio = Math.max(prio, 0);
      const promise = new Promise<void>((resolve) => {
        const load = async ([_, capabilities]: BlazorRootConfig) => {
          // let others finish first
          await Promise.all(depsWithPrios.filter((m) => m.prio > prio).map((m) => m.promise));

          window.dispatchEvent(new CustomEvent('loading-blazor-pilet', { detail: meta }));

          if (capabilities.includes('load')) {
            // new loading mechanism

            if (!capabilities.includes('language')) {
              satellites = undefined;
            }

            const dependencies = references.filter((m) => m.endsWith('.dll'));
            const dllUrl = dependencies.pop();
            const piletName = dllUrl.substring(0, dllUrl.length - 4);
            const piletPdb = `${piletName}.pdb`;
            const pdbUrl = references.find((m) => m === piletPdb);
            const id = Math.random().toString(26).substring(2);

            await loadBlazorPilet(id, {
              name: meta.name || '(unknown)',
              version: meta.version || '0.0.0',
              config: JSON.stringify(meta.config || {}),
              baseUrl: meta.basePath || dllUrl.substring(0, dllUrl.lastIndexOf('/')).replace('/_framework/', '/'),
              dependencies,
              satellites,
              dllUrl,
              pdbUrl,
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
          resolve();
        };
        let result = !lazy && convert.loader.then(load);
        dependency = (config) => result || (result = load(config));
      });

      if (prio) {
        depsWithPrios.push({
          prio,
          promise,
        });
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
