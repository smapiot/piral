import { GlobalState, NestedPartial } from 'piral-core';

function merge(target: any, source: any) {
  const type = typeof target;

  if (type === 'object' && type === typeof source) {
    if (Array.isArray(target)) {
      target.push(...source);
    } else {
      Object.keys(source).forEach(key => {
        const value = target[key];

        if (value && typeof value === 'object') {
          merge(value, source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  }
}

export function mergeStates<TState extends GlobalState>(
  ...states: Array<NestedPartial<TState>>
): NestedPartial<TState> {
  const state: NestedPartial<TState> = {};

  for (const s of states) {
    merge(state, s);
  }

  return state;
}
