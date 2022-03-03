import * as React from 'react';
import { useGlobalState } from '../hooks';
import {
  ComponentsState,
  ErrorInfoProps,
  LoadingIndicatorProps,
  RouterProps,
  LayoutProps,
  RouteSwitchProps,
} from '../types';

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
export const PiralError: React.ComponentType<ErrorInfoProps> = getPiralComponent('ErrorInfo');

/**
 * Gets the currently registered LoadingIndicator component.
 * By default only Loading is rendered.
 */
export const PiralLoadingIndicator: React.ComponentType<LoadingIndicatorProps> = getPiralComponent('LoadingIndicator');

/**
 * Gets the currently registered Router component.
 * By default the BrowserRouter is used.
 */
export const PiralRouter: React.ComponentType<RouterProps> = getPiralComponent('Router');

/**
 * Gets the currently registered Route Switch component.
 * By default the DefaultRouteSwitch component is used.
 */
export const PiralRouteSwitch: React.ComponentType<RouteSwitchProps> = getPiralComponent('RouteSwitch');

/**
 * Gets the currently registered Layout component.
 * By default the children are rendered.
 */
export const PiralLayout: React.ComponentType<LayoutProps> = getPiralComponent('Layout');

/**
 * Gets the currently registered Debug component.
 * By default nothing is used.
 */
export const PiralDebug: React.ComponentType = getPiralComponent('Debug');
