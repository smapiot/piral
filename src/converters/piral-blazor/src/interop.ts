import { emitRenderEvent, emitNavigateEvent } from './events';

const coreLib = 'Piral.Blazor.Core';

function createBlazorStarter(publicPath: string) {
  if (publicPath) {
    const baseElement =
      document.head.querySelector('base') || document.head.appendChild(document.createElement('base'));
    const originalBase = baseElement.href;
    baseElement.href = publicPath;
    return () => {
      window.Blazor._internal.navigationManager.getBaseURI = () => originalBase;
      return window.Blazor.start().then(() => {
        baseElement.href = originalBase;
      });
    };
  }

  return () => window.Blazor.start();
}

function computePath() {
  try {
    throw new Error();
  } catch (t) {
    const e = ('' + t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (e) {
      return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/, '$1') + '/';
    }
  }

  return '/';
}

export function activate(moduleName: string, props: any) {
  return window.DotNet.invokeMethodAsync(coreLib, 'Activate', moduleName, props);
}

export function reactivate(moduleName: string, referenceId: string, props: any) {
  return window.DotNet.invokeMethodAsync(coreLib, 'Reactivate', moduleName, referenceId, props).catch(() => {
    // Apparently an older version of Piral.Blazor, which does not support this
    // discard this error silently (in the future we may print warnings here)
  });
}

export function deactivate(moduleName: string, referenceId: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'Deactivate', moduleName, referenceId);
}

export async function loadResource(url: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', url);
}

export async function loadResourceWithSymbol(dllUrl: string, pdbUrl: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsWithSymbolsFromLibrary', dllUrl, pdbUrl);
}

export async function unloadResource(url: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', url);
}

export function initialize(scriptUrl: string, publicPath: string) {
  return new Promise((resolve, reject) => {
    const startBlazor = createBlazorStarter(publicPath);
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('autostart', 'false');

    script.onerror = () => reject();
    script.onload = () => {
      Object.assign(window.Blazor, {
        emitRenderEvent,
        emitNavigateEvent,
      });

      startBlazor().then(resolve);
    };

    document.body.appendChild(script);
  });
}

export function createBootLoader(scriptUrl: string) {
  const publicPath = computePath();
  return () => {
    if (typeof window.$blazorLoader === 'undefined') {
      window.$blazorLoader = initialize(scriptUrl, publicPath);
    }

    return window.$blazorLoader;
  };
}
