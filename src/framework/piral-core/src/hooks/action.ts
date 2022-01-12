import { useGlobalStateContext } from './globalState';
import { PiralActions, GlobalStateContext } from '../types';

/**
 * Hook that gets an action for manipulating the global state.
 * @param action The name of the action to retrieve.
 */
export function useAction<T extends keyof PiralActions>(action: T): GlobalStateContext[T] {
  const ctx = useGlobalStateContext();
  return ctx[action];
}
