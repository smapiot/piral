import { useContext } from 'react';
import { useAtom } from '@dbeining/react-atom';
import { StateContext } from '../state/stateContext';
import { GlobalState } from '../types';

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
  const { state } = useContext(StateContext);
  return useAtom(state, select && { select });
}
