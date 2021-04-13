import { isInternalNavigation, performInternalNavigation } from './navigation';

const blazorRootId = 'blazor-root';
const eventParents: Array<HTMLElement> = [];

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

const eventNames = {
  render: 'render-blazor-extension',
  navigate: 'navigate-blazor',
};

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

function dispatchToRoot(event: any) {
  isInternalNavigation(event) && performInternalNavigation(event);
  const eventClone = new event.constructor(event.type, event);
  document.getElementById(blazorRootId)?.dispatchEvent(eventClone);
}

export function emitRenderEvent(source: HTMLElement, name: string) {
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

export function emitNavigateEvent(source: HTMLElement, to: string, replace = false, state?: any) {
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

export function addGlobalEventListeners(el: HTMLElement) {
  globalEventNames.forEach((eventName) => el.addEventListener(eventName, dispatchToRoot));
}

export function removeGlobalEventListeners(el: HTMLElement) {
  globalEventNames.forEach((eventName) => el.removeEventListener(eventName, dispatchToRoot));
}
