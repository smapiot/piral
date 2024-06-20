import { createElement, ComponentType, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { GlobalStateContext, ForeignComponent } from '../types';

export const extensionName = 'piral-extension';
export const componentName = 'piral-component';
export const contentName = 'piral-content';
export const portalName = 'piral-portal';
export const slotName = 'piral-slot';

export function attachDomPortal<TProps>(
  id: string,
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  component: ComponentType<TProps>,
  props: TProps,
): [string, ReactPortal] {
  const portal = createPortal(createElement(component, props), element as HTMLElement);
  context.showPortal(id, portal);
  return [id, portal];
}

export function changeDomPortal<TProps>(
  id: string,
  current: ReactPortal,
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  component: ComponentType<TProps>,
  props: TProps,
): [string, ReactPortal] {
  const next = createPortal(createElement(component, props), element as HTMLElement);
  context.updatePortal(id, current, next);
  return [id, next];
}

export function convertComponent<T extends { type: string }, U>(
  converter: (component: T) => ForeignComponent<U>,
  component: T,
): ForeignComponent<U> {
  if (typeof converter !== 'function') {
    throw new Error(`No converter for component of type "${component.type}" registered.`);
  }

  return converter(component);
}

export function renderInDom<TProps>(
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  component: ComponentType<TProps>,
  props: TProps,
) {
  const portalId = 'pid';
  let parent: Node = element;

  while (parent) {
    if (parent instanceof Element && parent.localName === portalName && parent.hasAttribute(portalId)) {
      const id = parent.getAttribute(portalId);
      return attachDomPortal(id, context, element, component, props);
    }

    parent = parent.parentNode || (parent as ShadowRoot).host;
  }

  return attachDomPortal('root', context, element, component, props);
}

export function defer(cb: () => void) {
  setTimeout(cb, 0);
}
