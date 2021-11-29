import * as React from 'react';
import { ExtensionComponentProps } from '../types';

export function toExtension<T>(Component: React.ComponentType<T>): React.ComponentType<ExtensionComponentProps<T>> {
  return (props) => <Component {...props.params} />;
}
