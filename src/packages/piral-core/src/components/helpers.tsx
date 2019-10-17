import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ComponentsState, ErrorInfoProps, LoadingIndicatorProps, RouterProps, LayoutProps } from '../types';

export function getPiralComponent<TKey extends keyof ComponentsState>(name: TKey): ComponentsState[TKey] {
  return props => {
    const Component = useGlobalState(s => s.components[name]);
    return <Component {...props} />;
  };
}

export const PiralError: React.ComponentType<ErrorInfoProps> = getPiralComponent('ErrorInfo');
export const PiralLoadingIndicator: React.ComponentType<LoadingIndicatorProps> = getPiralComponent('LoadingIndicator');
export const PiralRouter: React.ComponentType<RouterProps> = getPiralComponent('Router');
export const PiralLayout: React.ComponentType<LayoutProps> = getPiralComponent('Layout');
