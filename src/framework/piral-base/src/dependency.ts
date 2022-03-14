import type { PiletApp, PiletExports, PiletMetadataV1, PiletMetadataBundle } from './types';

function tryResolve(name: string, parent: string) {
  try {
    return System.resolve(name, parent);
  } catch {
    // just ignore - will be handled differently later.
    return undefined;
  }
}

function requireModule(name: string, parent: string) {
  const moduleId = tryResolve(name, parent);
  const dependency = moduleId && System.get(moduleId);

  if (!dependency) {
    const error = new Error(`Cannot find module '${name}'`);
    (error as any).code = 'MODULE_NOT_FOUND';
    throw error;
  }

  return dependency;
}

function checkPiletApp(name: string, app?: PiletApp): PiletApp {
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

function checkPiletAppAsync(name: string, app?: PiletApp | Promise<PiletApp>): Promise<PiletApp> {
  return Promise.resolve(app).then((resolvedApp) => checkPiletApp(name, resolvedApp));
}

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

/**
 * Compiles the given content from a module with a dependency resolution.
 * @param name The name of the dependency to compile.
 * @param content The content of the dependency to compile.
 * @param link The optional link to the dependency.
 * @returns The evaluated module.
 */
export function compileDependency(name: string, content: string, link = ''): Promise<PiletApp> {
  const app = evalDependency(name, content, link);
  return checkPiletAppAsync(name, app);
}

declare global {
  interface HTMLScriptElement {
    app?: PiletApp;
  }
}

function includeScript(piletName: string, depName: string, link: string, integrity?: string, crossOrigin?: string) {
  window[depName] = (moduleId: string) => requireModule(moduleId, link);
  return includeScriptDependency(link, integrity, crossOrigin).then(
    (s) => checkPiletAppAsync(piletName, s.app),
    () => checkPiletApp(piletName),
  );
}

/**
 * Includes a dependency as a script.
 * @param link The link to the script.
 * @param integrity The integrity for the script, if any.
 * @param crossOrigin Defines if cross-origin should be used.
 * @returns The script element.
 */
export function includeScriptDependency(link: string, integrity?: string, crossOrigin?: string) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = link;

    if (integrity) {
      s.crossOrigin = crossOrigin || 'anonymous';
      s.integrity = integrity;
    } else if (crossOrigin) {
      s.crossOrigin = crossOrigin;
    }

    s.onload = () => resolve(s);
    s.onerror = () => reject();
    document.body.appendChild(s);
  });
}

/**
 * Includes the given single pilet script via its URL with a dependency resolution.
 * @param meta The meta data of the dependency to include.
 * @param crossOrigin The override for the cross-origin attribute.
 * @returns The evaluated module.
 */
export function includeDependency(meta: PiletMetadataV1, crossOrigin?: string) {
  return includeScript(meta.name, meta.requireRef, meta.link, meta.integrity, crossOrigin);
}

/**
 * Includes the given bundle script via its URL with a dependency resolution.
 * @param meta The meta data of the dependency to include.
 * @param crossOrigin The override for the cross-origin attribute.
 * @returns The evaluated module.
 */
export function includeBundle(meta: PiletMetadataBundle, crossOrigin?: string) {
  return includeScript(meta.name ?? '(bundle)', meta.bundle, meta.link, meta.integrity, crossOrigin);
}
