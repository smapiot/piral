import * as standardComponents from './components';
import { AppState } from 'piral-core';
import { Children, createElement, cloneElement, ReactNode, ReactChild, ReactElement } from 'react';

export function vitalize(elements: Array<ReactChild>, children: ReactNode, components: AppState['components']) {
  const target = Children.toArray(elements);

  for (let i = 0; i < target.length; i++) {
    const element = target[i] as ReactElement<any>;
    const type = element && element.type;
    const id = element && element.props && element.props.htmlFor;

    if (id && type === 'area') {
      const Area = components.custom[id] || components[id] || standardComponents[id];

      if (Area) {
        target[i] = createElement(Area, element.props);
      } else if (/^content$/i.test(id)) {
        target[i] = children as ReactChild;
      } else {
        target[i] = createElement(components.ErrorInfo, {
          type: 'feed',
          error: `Area ${id} not found!`,
        });
      }
    } else if (typeof type === 'string') {
      const kids = vitalize(element.props.children, children, components);
      target[i] = cloneElement(element, undefined, ...kids);
    }
  }

  return target;
}
