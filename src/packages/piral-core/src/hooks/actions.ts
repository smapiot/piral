import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { StateActions, GlobalStateContext } from '../types';

export function useActions<TActions extends {} = {}>() {
  const { state, ...actions } = useContext<GlobalStateContext<TActions>>(StateContext);
  return actions as StateActions & TActions;
}
