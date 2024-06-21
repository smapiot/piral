import { PiletApi } from 'piral-core';
import { emitRenderEvent, emitUpdateEvent, emitNavigateEvent, emitPiralEvent, blazorRootId } from './events';
import type { BlazorLogLevel, BlazorRootConfig, WebAssemblyStartOptions } from './types';

const wasmLib = 'Microsoft.AspNetCore.Components.WebAssembly';
const coreLib = 'Piral.Blazor.Core';

function isDotNet6OrBelow() {
  return typeof window.Blazor?._internal?.NavigationLock === 'undefined';
}

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

async function prepareForStartup() {
  const originalApplyHotReload = window.Blazor._internal.applyHotReload;
  const queue = [];

  const applyChanges = (api: PiletApi) => {
    const pilet = api.meta;

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

  const capabilities = await getCapabilities();

  if (capabilities.includes('custom-element')) {
    document.getElementById(blazorRootId).setAttribute('render', 'modern');
  }

  return {
    capabilities,
    applyChanges,
  };
}

function createBlazorStarter(publicPath: string): (opts: WebAssemblyStartOptions) => Promise<BlazorRootConfig> {
  const root = document.body.appendChild(document.createElement('div'));

  root.style.display = 'contents';
  root.id = blazorRootId;

  if (publicPath) {
    const baseElement = document.head.querySelector('base') || createBase();
    const originalBase = baseElement.href;
    baseElement.href = publicPath;

    return (opts) => {
      const navManager = window.Blazor._internal.navigationManager;

      //Overwrite to get NavigationManager in Blazor working, see https://github.com/smapiot/Piral.Blazor/issues/89
      navManager.navigateTo = (
        route: string,
        opts: { forceLoad: boolean; replaceHistoryEntry: boolean; historyEntryState: any },
      ) => {
        if (opts.forceLoad) {
          location.href = route;
          return;
        }

        if (route.startsWith(location.origin) && '') {
          // normalize "local" absolute URLs
          route = route.substring(location.origin.length);
        } else if (/^https?:\/\//.test(route)) {
          // prevent absolute URLs to be a standard navigation
          location.href = route;
          return;
        }

        window.Blazor.emitNavigateEvent(undefined, route, opts.replaceHistoryEntry, opts.historyEntryState);
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

function sanitize(props: any) {
  // children is a complex thing and will (in general) not be serializable
  // hence we need to make the JSObjectReference
  if ('children' in props && typeof props.children === 'object') {
    const { children, ...rest } = props;
    return {
      children: window.DotNet.createJSObjectReference(children),
      ...rest,
    };
  }

  return props;
}

export function processEvent(type: string, args: any) {
  return window.DotNet.invokeMethodAsync(coreLib, 'ProcessEvent', type, args);
}

export function setLogLevel(logLevel: BlazorLogLevel) {
  return window.DotNet.invokeMethodAsync(coreLib, 'SetLogLevel', logLevel);
}

export function createElement(moduleName: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'CreateElement', moduleName, sanitize(props));
}

export function updateElement(referenceId: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'UpdateElement', referenceId, sanitize(props));
}

export function destroyElement(referenceId: string): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'DestroyElement', referenceId);
}

export function activate(moduleName: string, props: any): Promise<string> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Activate', moduleName, sanitize(props));
}

export function reactivate(moduleName: string, referenceId: string, props: any): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Reactivate', moduleName, referenceId, sanitize(props)).catch(() => {
    // Apparently an older version of Piral.Blazor, which does not support this
    // discard this error silently (in the future we may print warnings here)
  });
}

export function deactivate(moduleName: string, referenceId: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'Deactivate', moduleName, referenceId);
}

export function callNotifyLocationChanged(url: string, replace: boolean, state: any): Promise<void> {
  if (isDotNet6OrBelow()) {
    return window.DotNet.invokeMethodAsync(wasmLib, 'NotifyLocationChanged', url, replace);
  } else {
    if (state !== undefined && typeof state !== 'string') {
      state = JSON.stringify(state);
    }

    return window.DotNet.invokeMethodAsync(wasmLib, 'NotifyLocationChanged', url, state, replace);
  }
}

export function setLanguage(language: string): Promise<void> {
  return window.DotNet.invokeMethodAsync(coreLib, 'SetLanguage', language);
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
  satellites?: Record<string, Array<string>>;
  dependencies: Array<string>;
  kind?: string;
  sharedDependencies?: Array<string>;
  dependencySymbols?: Array<string>;
}

export function loadBlazorPilet(id: string, data: PiletData) {
  return window.DotNet.invokeMethodAsync(coreLib, 'LoadPilet', id, data);
}

export function unloadBlazorPilet(id: string) {
  return window.DotNet.invokeMethodAsync(coreLib, 'UnloadPilet', id);
}

export function initialize(scriptUrl: string, publicPath: string, opts: WebAssemblyStartOptions = {}) {
  if (typeof opts.loadBootResource !== 'function') {
    opts.loadBootResource = (type, name, url) =>
      type === 'dotnetjs' ? url : fetch(url, { method: 'GET', cache: 'no-cache' });
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
        emitUpdateEvent,
        emitNavigateEvent,
        emitPiralEvent,
      });

      startBlazor(opts).then(resolve);
    };

    document.body.appendChild(script);
  });
}

export function createBootLoader(scriptUrl: string, extraScriptUrls: Array<string>) {
  const publicPath = computePath();

  return async (opts?: WebAssemblyStartOptions) => {
    const first = typeof window.$blazorLoader === 'undefined';

    if (first) {
      window.dispatchEvent(new CustomEvent('loading-blazor-core'));

      // we load all satellite scripts before we initialize blazor
      window.$blazorLoader = Promise.all(extraScriptUrls.map(addScript)).then(() =>
        initialize(scriptUrl, publicPath, opts),
      );
    }

    const config = await window.$blazorLoader;
    return {
      config,
      first,
    };
  };
}
