import { useGlobalState } from './globalState';
import { SharedDataItem, Dict } from '../types';

export function useSharedData(): Dict<SharedDataItem>;

export function useSharedData<R>(select: (source: Dict<SharedDataItem>) => R): R;

export function useSharedData<R>(s?: (source: Dict<SharedDataItem>) => R) {
  const select = s || (m => m);
  return useGlobalState(s => select(s.app.data));
}
