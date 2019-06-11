import { Children, createElement, cloneElement, ReactNode, ReactChild, ReactElement } from 'react';

export function vitalize(
  elements: Array<ReactChild>,
  children: ReactNode,
  getArea: (id: string) => React.ComponentType<any>,
) {
  const target = Children.toArray(elements);

  for (let i = 0; i < target.length; i++) {
    const element = target[i] as ReactElement<any>;
    const type = element && element.type;
    const id = element && element.props && element.props.htmlFor;

    if (id && type === 'area') {
      const Area = getArea(id);

      if (Area) {
        target[i] = createElement(Area, element.props);
      } else if (/^content$/i.test(id)) {
        target[i] = children as ReactChild;
      } else {
        target[i] = createElement(getArea('ErrorInfo'), {
          type: 'feed',
          error: `Area ${id} not found!`,
        });
      }
    } else if (typeof type === 'string') {
      const kids = vitalize(element.props.children, children, getArea);
      target[i] = cloneElement(element, undefined, ...kids);
    }
  }

  return target;
}
