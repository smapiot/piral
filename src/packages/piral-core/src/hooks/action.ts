import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { PiralActions } from '../types';

/**
 * Hook that gets an action for manipulating the global state.
 * @param action The name of the action to retrieve.
 */
export function useAction<T extends keyof PiralActions>(action: T) {
  const ctx = useContext(StateContext);
  return ctx[action];
}
