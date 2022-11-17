import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ComponentsState } from '../types';

/**
 * Gets a registered layout component by its name.
 * This will always return a valid component. If nothing is found
 * then the returned component will just return null.
 * @param name The name of the registered layout component.
 * @returns The registered layout component or an empty stub component.
 */
export function getPiralComponent<TKey extends keyof ComponentsState>(name: TKey): ComponentsState[TKey] {
  return (props) => {
    const Component = useGlobalState((s) => s.components[name]);
    // tslint:disable-next-line:no-null-keyword
    return Component ? <Component {...props} /> : null;
  };
}

/**
 * Gets the currently registered ErrorInfo component.
 * By default the DefaultErrorInfo component is used.
 */
export const RegisteredErrorInfo = getPiralComponent('ErrorInfo');

/**
 * Gets the currently registered LoadingIndicator component.
 * By default only Loading is rendered.
 */
export const RegisteredLoadingIndicator = getPiralComponent('LoadingIndicator');

/**
 * Gets the currently registered Router component.
 * By default the BrowserRouter is used.
 */
export const RegisteredRouter = getPiralComponent('Router');

/**
 * Gets the currently registered Route Switch component.
 * By default the DefaultRouteSwitch component is used.
 */
export const RegisteredRouteSwitch = getPiralComponent('RouteSwitch');

/**
 * Gets the currently registered Layout component.
 * By default the children are rendered.
 */
export const RegisteredLayout = getPiralComponent('Layout');

/**
 * Gets the currently registered Debug component.
 * By default nothing is used.
 */
export const RegisteredDebug = getPiralComponent('Debug');
