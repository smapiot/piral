import { requireModule } from './system';
import { promisify } from './helpers';
import type { PiletApp } from '../types';

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

export function checkPiletAppAsync(name: string, app?: PiletApp | Promise<PiletApp>): Promise<PiletApp> {
  return promisify(app).then((resolvedApp) => checkPiletApp(name, resolvedApp));
}

declare global {
  interface HTMLScriptElement {
    app?: PiletApp;
  }
}

export function includeScript(
  piletName: string,
  depName: string,
  link: string,
  integrity?: string,
  crossOrigin?: string,
) {
  window[depName] = requireModule;
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
