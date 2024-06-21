import type { ExtensionRegistration } from 'piral-core';
import { createElement } from 'react';
import { isInternalNavigation, performInternalNavigation } from './navigation';

export const blazorRootId = 'blazor-root';

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
  update: 'extension-props-changed',
  navigate: 'navigate-blazor',
  forward: 'forward-event',
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
  if (isInternalNavigation(event)) {
    performInternalNavigation(event);
  }

  // the mutation event cannot be cloned (at least in Webkit-based browsers)
  if (!(event instanceof MutationEvent) && !event.processed) {
    const eventClone = new event.constructor(event.type, event);
    document.getElementById(blazorRootId)?.dispatchEvent(eventClone);
    // make sure to only process every event once; even though multiple boundaries might be active
    event.processed = true;
  }
}

function getFallback(fallbackComponent: string, params: any) {
  if (typeof fallbackComponent === 'string') {
    const empty = undefined;
    return () => createElement('piral-extension', { name: fallbackComponent, params, empty });
  }

  return undefined;
}

function getOrder(sourceRef: any) {
  return typeof sourceRef !== 'undefined'
    ? (elements: Array<ExtensionRegistration>) => {
        const oldItems = elements.map((el, id) => ({
          id,
          pilet: el.pilet,
          defaults: el.defaults ?? {},
        }));
        const newItems: Array<{ id: number }> = sourceRef.invokeMethod('Order', oldItems);
        return newItems.map(({ id }) => elements[id]).filter(Boolean);
      }
    : undefined;
}

function getProps(name: string, params: any, sourceRef: any, fallbackComponent: string | null) {
  const empty = getFallback(fallbackComponent, params);
  const order = getOrder(sourceRef);

  return {
    name,
    params,
    empty,
    order,
  };
}

export function emitUpdateEvent(
  target: HTMLElement,
  name: string,
  params: any,
  sourceRef: any,
  fallbackComponent: string | null,
) {
  const container = findTarget(target);
  const eventInit = {
    detail: getProps(name, params, sourceRef, fallbackComponent),
  };

  container.dispatchEvent(new CustomEvent(eventNames.update, eventInit));
}

export function emitRenderEvent(
  target: HTMLElement,
  name: string,
  params: any,
  sourceRef: any,
  fallbackComponent: string | null,
) {
  const container = findTarget(target);
  const eventInit = {
    bubbles: true,
    detail: {
      configure() {
        sourceRef.invokeMethod('Configure', {
          CanUpdate: true,
        });
      },
      target,
      props: getProps(name, params, sourceRef, fallbackComponent),
    },
  };

  const delayEmit = () =>
    requestAnimationFrame(() => {
      if (!isRooted(container)) {
        return container.dispatchEvent(new CustomEvent(eventNames.render, eventInit));
      }

      const eventParent = eventParents[0];
      const root = document.getElementById(blazorRootId);

      // this would be used exclusively by providers
      if (eventParent && root.getAttribute('render') === 'modern') {
        return eventParent.dispatchEvent(new CustomEvent(eventNames.render, eventInit));
      }

      delayEmit();
    });

  delayEmit();
}

export function emitPiralEvent(type: string, args: any) {
  document.body.dispatchEvent(
    new CustomEvent(eventNames.forward, {
      bubbles: false,
      detail: {
        type,
        args,
      },
    }),
  );
}

export function emitNavigateEvent(target: HTMLElement, to: string, replace = false, state?: any) {
  const container = findTarget(target);
  container.dispatchEvent(
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

export function attachLocalEvents(
  host: HTMLElement,
  render: (ev: CustomEvent) => void,
  navigate: (ev: CustomEvent) => void,
) {
  host.addEventListener(eventNames.render, render, false);
  host.addEventListener(eventNames.navigate, navigate, false);
  // install proxy handlers
  globalEventNames.forEach((eventName) => host.addEventListener(eventName, dispatchToRoot));
  // register host as event parent
  eventParents.push(host);

  return () => {
    host.removeEventListener(eventNames.render, render, false);
    host.removeEventListener(eventNames.navigate, navigate, false);
    // uninstall proxy handlers
    globalEventNames.forEach((eventName) => host.removeEventListener(eventName, dispatchToRoot));
    // unregister host as event parent
    eventParents.splice(eventParents.indexOf(host), 1);
  };
}
