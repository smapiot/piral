import * as React from 'react';
import { useAction } from '../hooks';
import { ComponentsState } from '../types';

export interface DefineComponentProps<TKey extends keyof ComponentsState> {
  name: TKey;
  component: React.ComponentType<ComponentsState[TKey]>;
}

export function Define<TKey extends keyof ComponentsState>({ name, component }: DefineComponentProps<TKey>) {
  const setComponent = useAction('setComponent');
  React.useEffect(() => setComponent(name, component), []);
  return false;
}
