import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { PiralActions, GlobalStateContext } from '../types';

/**
 * Hook that gets the actions for manipulating the global state.
 */
export function useActions() {
  const { state, ...actions } = useContext<GlobalStateContext>(StateContext);
  return actions as PiralActions;
}
