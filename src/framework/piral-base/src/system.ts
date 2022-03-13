import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';
import type { PiletMetadataV2 } from './types';
import { setBasePath } from './utils';

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

const systemRegister = System.constructor.prototype.register;

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
 * Loads the provided SystemJS-powered pilet.
 * @param meta The pilet's metadata.
 */
export function loadSystemPilet(meta: PiletMetadataV2) {
  const deps = meta.dependencies;
  const link = setBasePath(meta, meta.link);

  if (deps) {
    for (const depName of Object.keys(deps)) {
      if (!System.has(depName)) {
        registerModule(depName, () => System.import(deps[depName]));
      }
    }
  }

  return loadSystemModule(link).then(([_, app]) => ({
    ...app,
    ...meta,
  }));
}

/**
 * Loads the provided modules by their URL. Performs a
 * SystemJS import.
 * @param modules The names of the modules to resolve.
 */
export function loadSystemModule(source: string) {
  return System.import(source).then(
    (value): [string, any] => [source, value],
    (error): [string, any] => {
      console.error('Failed to load SystemJS module', source, error);
      return [source, {}];
    },
  );
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
