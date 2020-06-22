import { useContext } from 'react';
import { useAtom, deref } from '@dbeining/react-atom';
import { StateContext } from '../state/stateContext';
import { GlobalState } from '../types';

const useGlobalAtom = typeof window !== 'undefined' ? useAtom : useDirectAtom;

function useDirectAtom(atom: any, opts: any) {
  const state = deref(atom);
  const select = opts && opts.select;
  return typeof select === 'function' ? select(state) : state;
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
  const { state } = useContext(StateContext);
  return useGlobalAtom(state, select && { select });
}
