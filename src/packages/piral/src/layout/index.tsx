import * as React from 'react';
import * as standardComponents from './components';
import { useGlobalState, AppState } from 'piral-core';
import { rehydrate } from './rehydrate';

function vitalize(elements: Array<React.ReactChild>, children: React.ReactNode, components: AppState['components']) {
  const target = React.Children.toArray(elements);

  for (let i = 0; i < target.length; i++) {
    const element = target[i] as React.ReactElement<any>;
    const type = element && element.type;
    const id = element && element.props && element.props.htmlFor;

    if (id && type === 'area') {
      const Area = components.custom[id] || components[id] || standardComponents[id];

      if (Area) {
        target[i] = React.createElement(Area, element.props);
      } else if (/^content$/i.test(id)) {
        target[i] = children as React.ReactChild;
      } else {
        target[i] = React.createElement(components.ErrorInfo, {
          type: 'feed',
          error: `Area ${id} not found!`,
        });
      }
    } else if (typeof type === 'string') {
      const kids = vitalize(element.props.children, children, components);
      target[i] = React.cloneElement(element, undefined, ...kids);
    }
  }

  return target;
}

export function getLayout(): React.SFC {
  const elements = rehydrate(document.querySelector('template[for=layout]'));

  return ({ children }) => {
    const components = useGlobalState(m => m.app.components);
    const layout = vitalize(elements, children, components);
    return <>{layout}</>;
  };
}
