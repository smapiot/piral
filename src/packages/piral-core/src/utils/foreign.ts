import { createElement, ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { GlobalStateContext } from '../types';

export function renderInDom<TProps>(
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  component: ComponentType<TProps>,
  props: TProps,
) {
  const portalId = 'data-portal-id';
  let parent = element.parentNode || (element as ShadowRoot).host;

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
