import { loadResource, loadResourceWithSymbol, unloadResource } from './interop';
import type { createConverter } from './converter';

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
          if (dllUrl.endsWith('.dll')) {
            const urlWithoutExtension = dllUrl.substr(0, dllUrl.length - 4);
            const pdbName = `${urlWithoutExtension}.pdb`;
            const pdbUrl = references.find((m) => m === pdbName);

            if (pdbUrl) {
              await loadResourceWithSymbol(dllUrl, pdbUrl);
            } else {
              await loadResource(dllUrl);
            }

            definedBlazorReferences.push(dllUrl);
          }
        }
      };
      let result = !lazy && convert.loader.then(load);
      dependency = () => result || (result = load());
    },
    async releaseBlazorReferences() {
      const references = definedBlazorReferences.splice(0, definedBlazorReferences.length);

      for (const reference of references) {
        await unloadResource(reference);
      }
    },
  };
}
