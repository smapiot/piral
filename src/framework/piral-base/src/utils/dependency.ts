import { emptyApp } from './empty';
import { requireModule } from './system';
import { getBasePath, isfunc, promisify } from './helpers';
import type { Pilet, PiletApiCreator, PiletApp, PiletMetadata } from '../types';

declare global {
  interface HTMLScriptElement {
    app?: PiletApp;
  }
}

export function createEvaluatedPilet(meta: Omit<PiletMetadata, 'basePath'>, mod: any): Pilet {
  const basePath = getBasePath(meta.link);
  const app = checkPiletApp(meta.name, mod);
  return { ...meta, ...app, basePath };
}

export function checkCreateApi(createApi: PiletApiCreator) {
  if (!isfunc(createApi)) {
    console.warn('Invalid `createApi` function. Skipping pilet installation.');
    return false;
  }

  return true;
}

/**
 * Checks the given pilet app for validity.
 * @param name The name of the pilet to check against.
 * @param app The evaluated app to check.
 * @returns The app to be used for the pilet.
 */
export function checkPiletApp(name: string, app?: any): PiletApp {
  if (!app) {
    console.error('Invalid module found.', name);
  } else if (typeof app.setup !== 'function') {
    console.warn('Setup function is missing.', name);
  } else {
    return app;
  }

  return emptyApp;
}

/**
 * Checks the given pilet app asynchrously for validity.
 * @param name The name of the pilet to check against.
 * @param app The evaluated - or evaluating - app to check.
 * @returns A promise resolving to the app of the pilet.
 */
export function checkPiletAppAsync(name: string, app?: PiletApp | Promise<PiletApp>): Promise<PiletApp> {
  return promisify(app).then((resolvedApp) => checkPiletApp(name, resolvedApp));
}

/**
 * Includes a pilet as a script.
 * @param depName The name of the dependency (require reference).
 * @param link The link to the script.
 * @param integrity The integrity for the script, if any.
 * @param crossOrigin Defines if cross-origin should be used.
 * @returns The promise resolving to the pilet app.
 */
export function includeScript(depName: string, link: string, integrity?: string, crossOrigin?: string) {
  window[depName] = (moduleId: string) => requireModule(moduleId, link);
  return includeScriptDependency(link, integrity, crossOrigin).then((s) => s.app);
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
    s.onerror = (e) => reject(e);
    document.body.appendChild(s);
  });
}
