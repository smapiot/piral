import { requireModule } from '../../utils';
import type { PiletExports } from '../../types';

/**
 * Compiles the given content from a generic dependency.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param link The optional link to the dependency.
 * @returns The evaluated dependency.
 */
export function evalDependency(name: string, content: string, link = '') {
  const mod = {
    exports: {},
  } as PiletExports;

  try {
    const sourceUrl = link && `\n//# sourceURL=${link}`;
    const importer = new Function('module', 'exports', 'require', content + sourceUrl);
    const parent = link || name;
    const require = (moduleId: string) => requireModule(moduleId, parent);
    importer(mod, mod.exports, require);
  } catch (e) {
    console.error(`Error while evaluating ${name}.`, e);
  }

  return mod.exports;
}
