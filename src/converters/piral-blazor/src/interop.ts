import { PiletMetadata } from 'piral-core';
import { emitRenderEvent, emitNavigateEvent } from './events';
import type { BlazorRootConfig, WebAssemblyStartOptions } from './types';

const wasmLib = 'Microsoft.AspNetCore.Components.WebAssembly';
const coreLib = 'Piral.Blazor.Core';

function createBase() {
  // Nothing found, we need to guess
  const el = document.createElement('base');
  let baseUrl = el.href;

  // The main app is served by a script - but we don't know which one
  // hence we just iterate over all the local ones and use the script
  // that is served from the "shortest" route - should work almost
  // always and if not - one can always explicitely set a <base> node
  for (let i = document.scripts.length; i--; ) {
    const s = document.scripts[i];
    const src = s.getAttribute('src');

    if (src && src.startsWith('/')) {
      const segEnd = src.lastIndexOf('/');
      const newUrl = src.substring(0, segEnd + 1);

      if (baseUrl.split('/').length > newUrl.split('/').length) {
        baseUrl = newUrl;
      }
    }
  }

  el.href = baseUrl;
  return document.head.appendChild(el);
}

function prepareForStartup() {
  const originalApplyHotReload = window.Blazor._internal.applyHotReload;
  const queue = [];
  const applyChanges = (pilet: PiletMetadata) => {
    if (pilet.config && pilet.config.blazorHotReload) {
      for (const item of queue.splice(0, queue.length)) {
        item();
      }

      window.Blazor._internal.applyHotReload = originalApplyHotReload;
    }
  };

  window.Blazor._internal.applyHotReload = function (...args) {
    queue.push(() => originalApplyHotReload.apply(this, args));
  };

  return getCapabilities().then((capabilities) => ({
    capabilities,
    applyChanges,
  }));
}

function createBlazorStarter(publicPath: string): (opts: WebAssemblyStartOptions) => Promise<BlazorRootConfig> {
  const root = document.body.appendChild(document.createElement('div'));

  root.style.display = 'none';
  root.id = 'blazor-root';

  if (publicPath) {
    const baseElement = document.head.querySelector('base') || createBase();
    const originalBase = baseElement.href;
    baseElement.href = publicPath;

    return (opts) => {
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

      return window.Blazor.start(opts)
        .then(prepareForStartup)
        .then(({ capabilities, applyChanges }) => {
          baseElement.href = originalBase;
          return [root, capabilities, applyChanges];
        });
    };
  }

  return (opts) =>
    window.Blazor.start(opts)
      .then(prepareForStartup)
      .then(({ capabilities, applyChanges }) => [root, capabilities, applyChanges]);
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

export function createElement(moduleName: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'CreateElement', moduleName, props);
}

export function updateElement(referenceId: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'UpdateElement', referenceId, props);
}

export function destroyElement(referenceId: string): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'DestroyElement', referenceId);
}

export function activate(moduleName: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Activate', moduleName, props);
}

export function reactivate(moduleName: string, referenceId: string, props: any): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Reactivate', moduleName, referenceId, props).catch(() => {
    // Apparently an older version of Piral.Blazor, which does not support this
    // discard this error silently (in the future we may print warnings here)
  });
}

export function deactivate(moduleName: string, referenceId: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Deactivate', moduleName, referenceId);
}

export function callNotifyLocationChanged(url: string, replace: boolean): Promise<void> {
  return window.DotNet.invokeMethodAsync(wasmLib, 'NotifyLocationChanged', url, replace);
}

export function getCapabilities(): Promise<Array<string>> {
  return window.DotNet.invokeMethodAsync(coreLib, 'GetCapabilities').catch(() => {
    // Apparently an older version of Piral.Blazor, which does not support this
    // discard this error silently (in the future we may print warnings here)
    return [];
  });
}

export function loadResource(url: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', url);
}

export function loadResourceWithSymbol(dllUrl: string, pdbUrl: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadComponentsWithSymbolsFromLibrary', dllUrl, pdbUrl);
}

export function unloadResource(url: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', url);
}

export interface PiletData {
  dllUrl: string;
  pdbUrl?: string;
  name: string;
  version: string;
  config: string;
  baseUrl: string;
  dependencies: Array<string>;
}

export function loadBlazorPilet(id: string, data: PiletData) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadPilet', id, data);
}

export function unloadBlazorPilet(id: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadPilet', id);
}

export function initialize(scriptUrl: string, publicPath: string, opts: WebAssemblyStartOptions = {}) {
  if (typeof opts.loadBootResource !== 'function') {
    opts.loadBootResource = (type, name, url) => type === 'dotnetjs' ? url : fetch(url, { method: 'GET', cache: 'no-cache' });
  }

  return new Promise<BlazorRootConfig>((resolve, reject) => {
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

      startBlazor(opts).then(resolve);
    };

    document.body.appendChild(script);
  });
}

export function createBootLoader(scriptUrl: string, satellites: Array<string>) {
  const publicPath = computePath();

  return (opts?: WebAssemblyStartOptions) => {
    if (typeof window.$blazorLoader === 'undefined') {
      // we load all satellite scripts before we initialize blazor
      window.$blazorLoader = Promise.all(satellites.map(addScript)).then(() => initialize(scriptUrl, publicPath, opts));
    }

    return window.$blazorLoader;
  };
}
