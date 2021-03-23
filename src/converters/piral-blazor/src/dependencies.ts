import { addReference } from './interop';
import type { createConverter } from './converter';

export function createDependencyLoader(convert: ReturnType<typeof createConverter>, lazy = true) {
  let dependency: () => Promise<any>;

  return {
    getDependency() {
      return dependency;
    },
    defineBlazorReferences(references) {
      const load = () =>
        Promise.all(
          references.map((reference) =>
            fetch(reference)
              .then((res) => res.blob())
              .then(addReference),
          ),
        );
      let result = !lazy && convert.loader.then(load);
      dependency = () => result || (result = load());
    },
  };
}
