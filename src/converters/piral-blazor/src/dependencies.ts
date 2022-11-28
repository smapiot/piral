import { loadResource, loadResourceWithSymbol, unloadResource } from './interop';
import type { createConverter } from './converter';

const loadedDependencies = (window.$blazorDependencies ??= []);

export function createDependencyLoader(convert: ReturnType<typeof createConverter>, lazy = true) {
  const definedBlazorReferences: Array<string> = [];
  let dependency: () => Promise<any>;

  return {
    getDependency() {
      return dependency;
    },
    defineBlazorReferences(references: Array<string>) {
      const load = async () => {
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
      };
      let result = !lazy && convert.loader.then(load);
      dependency = () => result || (result = load());
    },
    async releaseBlazorReferences() {
      const references = definedBlazorReferences.splice(0, definedBlazorReferences.length);

      for (const reference of references) {
        const entry = loadedDependencies.find((m) => m.name === reference);

        if (--entry.count === 0) {
          loadedDependencies.splice(loadedDependencies.indexOf(entry), 1);
          await unloadResource(entry.url);
        }
      }
    },
  };
}
