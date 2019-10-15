import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ComponentsState, ErrorInfoProps, LoaderProps, RouterProps, LayoutProps } from '../types';

export function getCommonComponent<TKey extends keyof ComponentsState>(name: TKey): ComponentsState[TKey] {
  return props => {
    const Component = useGlobalState(s => s.components[name]);
    return <Component {...props} />;
  };
}

export const ComponentError: React.ComponentType<ErrorInfoProps> = getCommonComponent('ErrorInfo');
export const ComponentLoader: React.ComponentType<LoaderProps> = getCommonComponent('Loader');
export const ComponentRouter: React.ComponentType<RouterProps> = getCommonComponent('Router');
export const ComponentLayout: React.ComponentType<LayoutProps> = getCommonComponent('Layout');
