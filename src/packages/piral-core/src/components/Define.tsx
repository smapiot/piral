import * as React from 'react';
import { useAction } from '../hooks';
import { ComponentsState } from '../types';

export interface DefineComponentProps<TKey extends keyof ComponentsState> {
  name: TKey;
  component: React.ComponentType<ComponentsState[TKey]>;
}

export function Define<TKey extends keyof ComponentsState>({
  name,
  component,
}: DefineComponentProps<TKey>): React.ReactElement {
  const setComponent = useAction('setComponent');
  React.useEffect(() => setComponent(name, component), []);
  // tslint:disable-next-line:no-null-keyword
  return null;
}
