import { emitRenderEvent, emitNavigateEvent } from './events';

const wasmLib = 'Microsoft.AspNetCore.Components.WebAssembly';
const coreLib = 'Piral.Blazor.Core';

function createBlazorStarter(publicPath: string): () => Promise<HTMLDivElement> {
  const root = document.body.appendChild(document.createElement('div'));

  root.style.display = 'none';
  root.id = 'blazor-root';

  if (publicPath) {
    const baseElement =
      document.head.querySelector('base') || document.head.appendChild(document.createElement('base'));
    const originalBase = baseElement.href;
    baseElement.href = publicPath;

    return () => {
      const navManager = window.Blazor._internal.navigationManager;

      //Overwrite to get NavigationManager in Blazor working, see https://github.com/smapiot/Piral.Blazor/issues/89
      navManager.navigateTo = (route: string, opts: { forceLoad: boolean; replaceHistoryEntry: boolean }) => {
        if (opts.forceLoad) {
          location.href = route;
        } else {
          window.Blazor.emitNavigateEvent(undefined, route, opts.replaceHistoryEntry);
        }
      };

      navManager.getBaseURI = () => originalBase;

      return window.Blazor.start().then(() => {
        baseElement.href = originalBase;
        return root;
      });
    };
  }

  return () => window.Blazor.start().then(() => root);
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

function addScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onerror = () => reject();
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
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

export function callNotifyLocationChanged(url: string, replace: boolean) {
  return window.DotNet.invokeMethodAsync(wasmLib, 'NotifyLocationChanged', url, replace);
}

export function loadResource(url: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', url);
}

export function loadResourceWithSymbol(dllUrl: string, pdbUrl: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsWithSymbolsFromLibrary', dllUrl, pdbUrl);
}

export function unloadResource(url: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', url);
}

export function initialize(scriptUrl: string, publicPath: string) {
  return new Promise<HTMLDivElement>((resolve, reject) => {
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

export function createBootLoader(scriptUrl: string, satellites: Array<string>) {
  const publicPath = computePath();

  return () => {
    if (typeof window.$blazorLoader === 'undefined') {
      // we load all satellite scripts before we initialize blazor
      window.$blazorLoader = Promise.all(satellites.map((url) => addScript(url))).then(() =>
        initialize(scriptUrl, publicPath),
      );
    }

    return window.$blazorLoader;
  };
}
