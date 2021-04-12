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

export function deactivate(moduleName: string, referenceId: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'Deactivate', moduleName, referenceId);
}

export function addReference(url: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', url);
}

export function removeReference(name: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', name);
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
  return () => initialize(scriptUrl, publicPath);
}
