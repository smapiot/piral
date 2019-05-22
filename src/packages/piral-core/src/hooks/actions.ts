import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { StateActions } from '../types';

export function useActions(): StateActions {
  const { state, ...actions } = useContext(StateContext);
  return actions;
}
