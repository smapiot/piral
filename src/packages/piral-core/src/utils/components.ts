import { ComponentType, ExoticComponent } from 'react';
import { AnyComponent, ComponentConverters } from '../types';

function isNotExotic(component: any): component is object {
  return !(component as ExoticComponent).$$typeof;
}

export function markReact<T>(arg: ComponentType<T>, displayName: string) {
  if (arg && !arg.displayName) {
    arg.displayName = displayName;
  }
}

export function convertComponent<T>(
  converters: ComponentConverters<T>,
  component: AnyComponent<T>,
  displayName: string,
) {
  if (typeof component === 'object' && isNotExotic(component)) {
    const converter = converters[component.type];

    if (typeof converter !== 'function') {
      throw new Error(`No converter for component of type "${component.type}" registered.`);
    }

    return converter(component);
  } else {
    markReact(component, displayName);
    return component;
  }
}
