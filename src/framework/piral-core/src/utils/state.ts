import { cloneElement, ComponentType, createElement } from 'react';
import { RouteComponentProps } from 'react-router';
import { toExtension } from './extension';
import { withKey, withoutKey, appendItem, excludeOn } from './helpers';
import { GlobalState, PageRegistration, ExtensionRegistration } from '../types';

/**
 * Returns a dispatcher that includes all mentioned dispatchers.
 * @param dispatchers The dispatchers to include.
 */
export function withAll(...dispatchers: Array<(state: GlobalState) => GlobalState>) {
  return (state: GlobalState): GlobalState => {
    for (const dispatcher of dispatchers) {
      state = dispatcher(state);
    }

    return state;
  };
}

/**
 * Returns a dispatcher that adds a page registration.
 * @param name The path of the page to register.
 * @param value The value of the page to register.
 * @returns The dispatcher.
 */
export function withPage(name: string, value: PageRegistration) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withKey(state.registry.pages, name, value),
    },
  });
}

/**
 * Returns a dispatcher that removes a page registration.
 * @param name The path of the page to unregister.
 * @returns The dispatcher.
 */
export function withoutPage(name: string) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    registry: {
      ...state.registry,
      pages: withoutKey(state.registry.pages, name),
    },
  });
}

/**
 * Returns a dispatcher that adds an extension registration.
 * @param name The name of the extension to register.
 * @param value The value of the extension to register.
 * @returns The dispatcher.
 */
export function withExtension(name: string, value: ExtensionRegistration) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(state.registry.extensions, name, appendItem(state.registry.extensions[name], value)),
    },
  });
}

/**
 * Returns a dispatcher that removes an extension registration.
 * @param name The name of the extension to unregister.
 * @param reference The reference for the extension.
 * @returns The dispatcher.
 */
export function withoutExtension(name: string, reference: any) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    registry: {
      ...state.registry,
      extensions: withKey(
        state.registry.extensions,
        name,
        excludeOn(state.registry.extensions[name], (m) => m.reference === reference),
      ),
    },
  });
}

/**
 * Returns a dispatcher that adds an extension registration from the root (no Pilet API).
 * @param name The name of the extension to register.
 * @param component The extension's component to use.
 * @returns The dispatcher.
 */
export function withRootExtension<T>(name: string, component: ComponentType<T>) {
  return withExtension(name, {
    component: toExtension(component),
    defaults: {},
    pilet: '',
    reference: component,
  });
}

/**
 * Returns a dispatcher that adds another provider.
 * @param provider The provider to include.
 * @returns The dispatcher.
 */
export function withProvider(provider: JSX.Element) {
  const wrapper: React.FC = (props) => cloneElement(provider, props);

  return (state: GlobalState): GlobalState => ({
    ...state,
    provider: !state.provider ? wrapper : (props) => createElement(state.provider, undefined, wrapper(props)),
  });
}

/**
 * Returns a dispatcher that registers another route.
 * @param path The path of the route to register.
 * @param component The component representing the route.
 * @returns The dispatcher.
 */
export function withRoute<T extends { [K in keyof T]?: string } = {}>(
  path: string,
  component: ComponentType<RouteComponentProps<T>>,
) {
  return (state: GlobalState): GlobalState => ({
    ...state,
    routes: withKey(state.routes, path, component),
  });
}
