import { useContext } from 'react';
import { useAtom } from '@dbeining/react-atom';
import { StateContext } from '../state/stateContext';
import { GlobalState } from '../types';

export function useGlobalState(): GlobalState;

export function useGlobalState<R>(select: (state: GlobalState) => R): R;

export function useGlobalState<R>(select?: (state: GlobalState) => R) {
  const { state } = useContext(StateContext);
  return useAtom(state, select && { select });
}
