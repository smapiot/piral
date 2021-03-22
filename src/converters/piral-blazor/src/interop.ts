export const eventNames = {
  render: 'render-blazor-extension',
  navigate: 'navigate-blazor',
};

const coreLib = 'Piral.Blazor.Core';
const eventParents: Array<HTMLElement> = [];
const blazorRootId = 'blazor-root';

const globalEventNames = [
  'abort',
  'blur',
  'change',
  'error',
  'focus',
  'load',
  'loadend',
  'loadstart',
  'mouseenter',
  'mouseleave',
  'progress',
  'reset',
  'scroll',
  'submit',
  'unload',
  'DOMNodeInsertedIntoDocument',
  'DOMNodeRemovedFromDocument',
  'click',
  'dblclick',
  'mousedown',
  'mousemove',
  'mouseup',
];

function dispatchToRoot(event: Event) {
  document.getElementById(blazorRootId)?.dispatchEvent(new Event(event.type, event));
}

function isRooted(target: HTMLElement) {
  let parent = target.parentElement;

  while (parent) {
    if (parent.id === blazorRootId) {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

function findTarget(target: HTMLElement = document.body) {
  if (eventParents.length === 0) {
    return target;
  } else if (target === document.body) {
    return eventParents[0];
  } else {
    return target;
  }
}

function emitRenderEvent(source: HTMLElement, name: string) {
  const target = findTarget(source);
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
}

function emitNavigateEvent(source: HTMLElement, to: string, replace = false, state?: any) {
  findTarget(source).dispatchEvent(
    new CustomEvent(eventNames.navigate, {
      bubbles: true,
      detail: {
        to,
        replace,
        state,
      },
    }),
  );
}

export function addGlobalEventListeners(el: HTMLElement) {
  globalEventNames.forEach((eventName) => el.addEventListener(eventName, dispatchToRoot));
}

export function removeGlobalEventListeners(el: HTMLElement) {
  globalEventNames.forEach((eventName) => el.removeEventListener(eventName, dispatchToRoot));
}

export function activate(moduleName: string, props: any) {
  return window['DotNet'].invokeMethodAsync<string>(coreLib, 'Activate', moduleName, props);
}

export function deactivate(moduleName: string, referenceId: string) {
  return window['DotNet'].invokeMethodAsync<string>(coreLib, 'Deactivate', moduleName, referenceId);
}

export function addReference(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result.toString().replace(/^data:.+;base64,/, '');
      window['DotNet'].invokeMethodAsync(coreLib, 'LoadComponentsFromLibrary', data).then(resolve);
    };
    reader.readAsDataURL(blob);
  });
}

export function removeReference(name: string) {
  return window['DotNet'].invokeMethodAsync(coreLib, 'UnloadComponentsFromLibrary', name);
}

export function attachEvents(
  host: HTMLElement,
  render: (ev: CustomEvent) => void,
  navigate: (ev: CustomEvent) => void,
) {
  eventParents.push(host);
  host.addEventListener(eventNames.render, render, false);
  host.addEventListener(eventNames.navigate, navigate, false);
  return () => {
    eventParents.splice(eventParents.indexOf(host), 1);
    host.removeEventListener(eventNames.render, render, false);
    host.removeEventListener(eventNames.navigate, navigate, false);
  };
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
