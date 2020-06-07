import { createElement, ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { GlobalStateContext, ForeignComponent } from '../types';

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
  const portalId = 'data-portal-id';
  let parent: Node = element;

  while (parent) {
    if (parent instanceof Element && parent.hasAttribute(portalId)) {
      const portal = createPortal(createElement(component, props), element as HTMLElement);
      const id = parent.getAttribute(portalId);
      context.showPortal(id, portal);
      return id;
    }

    parent = parent.parentNode || (parent as ShadowRoot).host;
  }

  return undefined;
}
