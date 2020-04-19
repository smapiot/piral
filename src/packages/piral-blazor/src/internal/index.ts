import './globals';
import { setPlatform } from './Environment';
import { Pointer } from './Platform/Platform';
import { navigationManager } from './Services/NavigationManager';
import { BootJsonData, BootConfigResult } from './Platform/BootConfig';
import { monoPlatform } from './Platform/Mono/MonoPlatform';
import { WebAssemblyResourceLoader } from './Platform/WebAssemblyResourceLoader';
import { WebAssemblyConfigLoader } from './Platform/WebAssemblyConfigLoader';
import { renderBatch } from './Rendering/Renderer';
import { SharedMemoryRenderBatch } from './Rendering/RenderBatch/SharedMemoryRenderBatch';
import { attachRootComponentToElement } from './Rendering/Renderer';
import { setEventDispatcher } from './Rendering/RendererEventDispatcher';

export { BootJsonData };

export const eventNames = {
  render: 'render-blazor-extension',
  navigate: 'navigate-blazor',
};

const coreLib = 'Piral.Blazor.Core';

function isRooted(target: HTMLElement) {
  let parent = target.parentElement;

  while (parent) {
    if (parent.id === 'blazor-root') {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

export function activate(moduleName: string, props: any) {
  return DotNet.invokeMethodAsync<string>(coreLib, 'Activate', moduleName, props);
}

export function deactivate(moduleName: string, referenceId: string) {
  return DotNet.invokeMethodAsync<string>(coreLib, 'Deactivate', moduleName, referenceId);
}

export function addReference(blob: Blob) {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.onload = () => {
      const data = reader.result.toString().replace(/^data:.+;base64,/, '');
      DotNet.invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', data).then(resolve);
    };
    reader.readAsDataURL(blob);
  });
}

export function attachEvents(
  host: HTMLElement,
  render: (ev: CustomEvent) => void,
  navigate: (ev: CustomEvent) => void,
) {
  host.addEventListener(eventNames.render, render, false);
  host.addEventListener(eventNames.navigate, navigate, false);
  return () => {
    host.removeEventListener(eventNames.render, render, false);
    host.removeEventListener(eventNames.navigate, navigate, false);
  };
}

export async function initialize(data: BootJsonData) {
  data.cacheBootResources = false;

  setEventDispatcher((eventDescriptor, eventArgs) =>
    DotNet.invokeMethodAsync(
      'Microsoft.AspNetCore.Components.WebAssembly',
      'DispatchEvent',
      eventDescriptor,
      JSON.stringify(eventArgs),
    ),
  );

  // Configure environment for execution under Mono WebAssembly with shared-memory rendering
  const platform = setPlatform(monoPlatform);

  Object.assign(window['Blazor'], {
    platform,
    emitRenderEvent(target: HTMLElement, name: string) {
      const eventInit = {
        bubbles: true,
        detail: {
          target,
          props: {
            name,
          },
        },
      };
      const delayEmit = () =>
        requestAnimationFrame(() => {
          if (!isRooted(target)) {
            target.dispatchEvent(new CustomEvent(eventNames.render, eventInit));
          } else {
            delayEmit();
          }
        });
      delayEmit();
    },
    emitNavigateEvent(target: HTMLElement, to: string) {
      target.dispatchEvent(
        new CustomEvent(eventNames.navigate, {
          bubbles: true,
          detail: {
            to,
          },
        }),
      );
    },
  });

  Object.assign(window['Blazor']._internal, {
    navigationManager,
    attachRootComponentToElement,
    renderBatch(browserRendererId: number, batchAddress: Pointer) {
      renderBatch(browserRendererId, new SharedMemoryRenderBatch(batchAddress));
    },
  });

  const bootConfigResult = new BootConfigResult(data);

  const [resourceLoader] = await Promise.all([
    WebAssemblyResourceLoader.initAsync(bootConfigResult.bootConfig),
    WebAssemblyConfigLoader.initAsync(bootConfigResult),
  ]);

  try {
    await platform.start(resourceLoader);
    platform.callEntryPoint(resourceLoader.bootConfig.entryAssembly);
  } catch (ex) {
    throw new Error(`Failed to start platform. Reason: ${ex}`);
  }

  return {
    platform,
  };
}
