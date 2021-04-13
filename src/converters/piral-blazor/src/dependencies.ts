import { loadResource, loadResourceWithSymbol } from './interop';
import type { createConverter } from './converter';

export function createDependencyLoader(convert: ReturnType<typeof createConverter>, lazy = true) {
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
          }
        }
      };
      let result = !lazy && convert.loader.then(load);
      dependency = () => result || (result = load());
    },
  };
}
