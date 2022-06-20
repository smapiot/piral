import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { GlobalState } from '../types';

/**
 * Hook to obtain the global state context, which gives you directly
 * all actions, state, and more of the Piral instance.
 * If you are only interested in reading out the state, use the
 * `useGlobalState` hook instead.
 */
export function useGlobalStateContext() {
  return useContext(StateContext);
}

/**
 * Hook that yields the full global state.
 * Any change to the global state yields the new state.
 */
export function useGlobalState(): GlobalState;

/**
 * Hook that yields the selected subset of the global state.
 * Only changes to this subset will yield a new state.
 * @param select The subset selection.
 */
export function useGlobalState<R>(select: (state: GlobalState) => R): R;

export function useGlobalState<R>(select?: (state: GlobalState) => R) {
  const { state: useState } = useGlobalStateContext();
  return useState(select);
}
