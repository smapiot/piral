import { ComponentType } from 'react';
import { AnyComponent, ComponentConverters } from '../types';

export function markReact<T>(arg: ComponentType<T>, displayName: string) {
  if (arg && !arg.displayName) {
    arg.displayName = displayName;
  }
}

//TODO
declare const converters: ComponentConverters;

export function convertComponent<T>(component: AnyComponent<T>, displayName: string) {
  if (typeof component === 'object') {
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
