import { useContext } from 'react';
import { StateContext } from '../state/stateContext';
import { StateActions } from '../types';

export function useAction<T extends keyof StateActions>(action: T) {
  const ctx = useContext(StateContext);
  return ctx[action];
}
