import { emitRenderEvent, emitNavigateEvent } from './events';

const coreLib = 'Piral.Blazor.Core';

export function activate(moduleName: string, props: any) {
  return window['DotNet'].invokeMethodAsync<string>(coreLib, 'Activate', moduleName, props);
}

export function deactivate(moduleName: string, referenceId: string) {
  return window['DotNet'].invokeMethodAsync<string>(coreLib, 'Deactivate', moduleName, referenceId);
}

export function addReference(url: string) {
  return window['DotNet'].invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', url);
}

export function removeReference(name: string) {
  return window['DotNet'].invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', name);
}

export function initialize(scriptUrl: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('autostart', 'false');

    script.onerror = () => reject();
    script.onload = () => {
      Object.assign(window['Blazor'], {
        emitRenderEvent,
        emitNavigateEvent,
      });

      window['Blazor'].start().then(resolve);
    };

    document.body.appendChild(script);
  });
}
