import * as React from 'react';
import { ExtensionComponentProps, WrappedComponent } from '../types';

export function toExtension<T>(Component: React.ComponentType<T>): WrappedComponent<ExtensionComponentProps<T>> {
  return (props) => <Component {...props.params} />;
}
