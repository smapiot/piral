import { GenericPiletApp, AvailableDependencies, GenericPiletExports } from './types';

function requireModule(name: string, dependencies: AvailableDependencies) {
  const dependency = dependencies[name];

  if (!dependency) {
    const error = new Error(`Cannot find module '${name}'`);
    (error as any).code = 'MODULE_NOT_FOUND';
    throw error;
  }

  return dependency;
}

function checkPiletApp<TApi>(app?: GenericPiletApp<TApi>): GenericPiletApp<TApi> {
  if (!app) {
    console.error('Invalid module found.', name);
  } else if (typeof app.setup !== 'function') {
    console.warn('Setup function is missing.', name);
  } else {
    return app;
  }

  return {
    setup() {},
  };
}

/**
 * Compiles the given content from a generic dependency.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param link The optional link to the dependency.
 * @param dependencies The globally available dependencies.
 * @returns The evaluated dependency.
 */
export function evalDependency<TApi>(
  name: string,
  content: string,
  link = '',
  dependencies: AvailableDependencies = {},
) {
  const mod = {
    exports: {},
  } as GenericPiletExports<TApi>;
  const require = (moduleName: string) => requireModule(moduleName, dependencies);

  try {
    const sourceUrl = link && `\n//# sourceURL=${link}`;
    const importer = new Function('module', 'exports', 'require', content + sourceUrl);
    importer(mod, mod.exports, require);
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
 * @param dependencies The globally available dependencies.
 * @returns The evaluated module.
 */
export function compileDependency<TApi>(
  name: string,
  content: string,
  link = '',
  dependencies: AvailableDependencies = {},
): Promise<GenericPiletApp<TApi>> {
  const app = evalDependency<TApi>(name, content, link, dependencies);
  return Promise.resolve(app).then(checkPiletApp);
}
