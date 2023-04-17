import { satisfies, validate } from 'piral-cli/src/common/version';
import { emptyApp } from './empty';

const systemResolve = System.constructor.prototype.resolve;
const systemRegister = System.constructor.prototype.register;

function getLoadedVersions(prefix: string) {
  return [...System.entries()]
    .filter(([name]) => name.startsWith(prefix))
    .map(([name]) => name.substring(prefix.length));
}

function findMatchingPackage(id: string) {
  const sep = id.indexOf('@', 1);

  if (sep > 1) {
    const available = Object.keys((System as any).registerRegistry);
    const name = id.substring(0, sep + 1);
    const versionSpec = id.substring(sep + 1);

    if (validate(versionSpec)) {
      const loadedVersions = getLoadedVersions(name);
      const allVersions = available.filter((m) => m.startsWith(name)).map((m) => m.substring(name.length));
      // Moves the loaded versions to the top
      const availableVersions = [...loadedVersions, ...allVersions.filter((m) => !loadedVersions.includes(m))];

      for (const availableVersion of availableVersions) {
        if (validate(availableVersion) && satisfies(availableVersion, versionSpec)) {
          return name + availableVersion;
        }
      }
    }
  }

  return undefined;
}

function isPrimitiveExport(content: any) {
  const type = typeof content;
  return (
    type === 'number' ||
    type === 'boolean' ||
    type === 'symbol' ||
    type === 'string' ||
    type === 'bigint' ||
    Array.isArray(content)
  );
}

System.constructor.prototype.resolve = function (id: string, parentUrl: string) {
  try {
    return systemResolve.call(this, id, parentUrl);
  } catch (ex) {
    const result = findMatchingPackage(id);

    if (!result) {
      throw ex;
    }

    return result;
  }
};

System.constructor.prototype.register = function (...args) {
  const getContent = args.pop() as System.DeclareFn;

  args.push((_export, ctx) => {
    const exp = (...p) => {
      if (p.length === 1) {
        const content = p[0];

        if (content instanceof Promise) {
          return content.then(exp);
        } else if (typeof content === 'function') {
          _export('__esModule', true);
          Object.keys(content).forEach((prop) => {
            _export(prop, content[prop]);
          });
          _export('default', content);
        } else if (isPrimitiveExport(content)) {
          _export('__esModule', true);
          _export('default', content);
        } else if (content) {
          _export(content);

          if (typeof content === 'object' && !('default' in content)) {
            _export('default', content);
          }
        }
      } else {
        return _export(...p);
      }
    };
    return getContent(exp, ctx);
  });

  return systemRegister.apply(this, args);
};

function tryResolve(name: string, parent: string) {
  try {
    return System.resolve(name, parent);
  } catch {
    // just ignore - will be handled differently later.
    return undefined;
  }
}

function handleFailure(error: Error, link: string) {
  console.error('Failed to load SystemJS module', link, error);
  return emptyApp;
}

/**
 * Imports a pilet via SystemJS.
 * @param link The link to the pilet's root module.
 * @returns The evaluated pilet or an empty pilet in case of an error.
 */
export function loadSystemPilet(link: string) {
  return System.import(link).catch((error) => handleFailure(error, link));
}

export interface ModuleResolver {
  (): any;
}

/**
 * Registers all static global dependencies in the system.
 * @param modules The modules to register as dependencies.
 * @returns A promise when SystemJS included all dependencies.
 */
export function registerDependencies(modules: Record<string, any>) {
  const moduleNames = Object.keys(modules);
  moduleNames.forEach((name) => registerModule(name, () => modules[name]));
  return Promise.all(moduleNames.map((name) => System.import(name)));
}

/**
 * Registers a plain module in SystemJS.
 * @param name The name of the module
 * @param resolve The resolver for the module's content.
 */
export function registerModule(name: string, resolve: ModuleResolver) {
  System.register(name, [], (_exports) => ({
    execute() {
      const content = resolve();

      if (content instanceof Promise) {
        return content.then(_exports);
      } else {
        _exports(content);
      }
    },
  }));
}

/**
 * Registers the given dependency URLs in SystemJS.
 * @param dependencies The dependencies to resolve later.
 */
export function registerDependencyUrls(dependencies: Record<string, string>) {
  for (const name of Object.keys(dependencies)) {
    if (!System.has(name)) {
      const dependency = dependencies[name];
      registerModule(name, () => System.import(dependency));
    }
  }
}

/**
 * Unregisters all modules coming from the given base URL.
 * @param baseUrl The base URL used to identify the modules to delete to.
 * @param dependencies The shared dependencies from the pilet. These will be left alive.
 */
export function unregisterModules(baseUrl: string, dependencies: Array<string>) {
  [...System.entries()]
    .map(([name]) => name)
    .filter((name) => name.startsWith(baseUrl) && !dependencies.includes(name))
    .forEach((name) => System.delete(name));
}

/**
 * Requires a module from SystemJS
 * @param name The name of the module to obtain
 * @returns The module's content, if any, otherwise throws an error.
 */
export function requireModule(name: string, parent: string) {
  const moduleId = tryResolve(name, parent);
  const dependency = moduleId && System.get(moduleId);

  if (!dependency) {
    const error: any = new Error(`Cannot find module '${name}'`);
    error.code = 'MODULE_NOT_FOUND';
    throw error;
  }

  return dependency;
}
