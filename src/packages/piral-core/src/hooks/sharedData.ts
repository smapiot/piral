import { useGlobalState } from './globalState';
import { SharedDataItem, Dict } from '../types';

/**
 * Hook that yields the full shared data.
 * Any change to the shared data yields the new data.
 */
export function useSharedData(): Dict<SharedDataItem>;

/**
 * Hook that yields the selected subset of the shared data.
 * Only changes to this subset will yield a new data state.
 * @param select The subset selection.
 */
export function useSharedData<R>(select: (source: Dict<SharedDataItem>) => R): R;

export function useSharedData<R>(s?: (source: Dict<SharedDataItem>) => R) {
  const select = s || (m => m);
  return useGlobalState(s => select(s.app.data));
}
