import { requireModule, checkPiletAppAsync } from '../../utils';
import type { SinglePiletApp, PiletExports } from '../../types';

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
    importer(mod, mod.exports, requireModule);
  } catch (e) {
    console.error(`Error while evaluating ${name}.`, e);
  }

  return mod.exports;
}

/**
 * Compiles the given content from a module with a dependency resolution.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param link The optional link to the dependency.
 * @returns The evaluated module.
 */
export function compileDependency(name: string, content: string, link = '') {
  const app = evalDependency(name, content, link);
  return checkPiletAppAsync(name, app) as Promise<SinglePiletApp>;
}
