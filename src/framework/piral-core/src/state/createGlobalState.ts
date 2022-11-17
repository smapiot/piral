import create from 'zustand';
import { createDefaultState } from '../../app.codegen';
import { GlobalState, NestedPartial } from '../types';

function extend<T>(defaultState: T, customState: NestedPartial<T>) {
  for (const key of Object.keys(customState)) {
    if (key === '__proto__' || key === 'constructor') {
      continue;
    }

    const value = customState[key];
    const original = defaultState[key];
    const nested = typeof original === 'object' && typeof value === 'object';
    defaultState[key] = nested ? extend(original, value) : value;
  }

  return defaultState;
}

export function createGlobalState(customState: NestedPartial<GlobalState> = {}) {
  const defaultState: GlobalState = createDefaultState();
  return create(() => extend(defaultState, customState));
}
