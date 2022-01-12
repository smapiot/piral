import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

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

        if (typeof content === 'function') {
          _exports('__esModule', true);
          _exports('default', content);
        } else if (typeof content === 'object') {
          if (content && !Array.isArray(content) && !('default' in content)) {
            _exports('default', content);
          }
        }
      }
    },
  }));
}

export function requireModule(name: string) {
  const dependency = System.get(name);

  if (!dependency) {
    const error = new Error(`Cannot find module '${name}'`);
    (error as any).code = 'MODULE_NOT_FOUND';
    throw error;
  }

  return dependency;
}
