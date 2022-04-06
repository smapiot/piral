import * as React from 'react';
import { useGlobalStateContext, useSetter } from '../hooks';
import { ComponentsState } from '../types';

/**
 * The props for the SetComponent component.
 */
export interface SetComponentProps<TKey extends keyof ComponentsState> {
  /**
   * The name of the shared component to set.
   */
  name: TKey;
  /**
   * The shared component to define.
   */
  component: ComponentsState[TKey];
}

/**
 * The component capable of setting a layout component at mounting.
 */
export function SetComponent<TKey extends keyof ComponentsState>({
  name,
  component,
}: SetComponentProps<TKey>): React.ReactElement {
  const { setComponent } = useGlobalStateContext();
  useSetter(() => component && setComponent(name, component));
  // tslint:disable-next-line:no-null-keyword
  return null;
}
