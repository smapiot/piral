import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';
import { satisfies, validate } from './version';

const systemResolve = System.constructor.prototype.resolve;
const systemRegister = System.constructor.prototype.register;

function findMatchingPackage(id: string) {
  const sep = id.indexOf('@', 1);

  if (sep > 1) {
    const available = Object.keys((System as any).registerRegistry);
    const name = id.substring(0, sep + 1);
    const versionSpec = id.substring(sep + 1);

    if (validate(versionSpec)) {
      const availableVersions = available.filter((m) => m.startsWith(name)).map((m) => m.substring(name.length));

      for (const availableVersion of availableVersions) {
        if (validate(availableVersion) && satisfies(availableVersion, versionSpec)) {
          return name + availableVersion;
        }
      }
    }
  }

  return undefined;
}

function tryResolve(name: string, parent: string) {
  try {
    return System.resolve(name, parent);
  } catch {
    // just ignore - will be handled differently later.
    return undefined;
  }
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
        _export(...p);
      }
    };
    return getContent(exp, ctx);
  });

  return systemRegister.apply(this, args);
};

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
 * Unregisters all modules coming from the given base URL.
 * @param baseUrl The base URL used to identify the modules to delete to.
 */
export function unregisterModules(baseUrl: string) {
  [...System.entries()]
    .map(([name]) => name)
    .filter((name) => name.startsWith(baseUrl))
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
