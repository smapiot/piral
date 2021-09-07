import { useState, useEffect } from 'react';

export interface PiralDebugState {
  visualize: {
    force: boolean;
    active: boolean;
  };
  route: string;
}

const listeners: Array<() => void> = [];

let state: PiralDebugState = {
  visualize: {
    active: false,
    force: false,
  },
  route: undefined,
};

export function setState(dispatch: (arg: PiralDebugState) => PiralDebugState) {
  const newState = dispatch(state);

  if (newState !== state) {
    state = newState;
  }
}

export function getState() {
  return {
    ...state,
  };
}

export function subscribe<T>(select: (arg: PiralDebugState) => T, notify: (state: T) => void) {
  let prevState = select(state);
  const cb = () => {
    const nextState = select(state);

    if (prevState !== nextState) {
      prevState = nextState;
      notify(nextState);
    }
  };
  const unsubscribe = () => {
    const idx = listeners.indexOf(cb);

    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  };
  listeners.push(cb);
  return unsubscribe;
}

export function useDebugState<T>(select: (arg: PiralDebugState) => T) {
  const [state, setState] = useState(() => select(getState()));
  useEffect(() => subscribe<T>(select, setState), [select]);
  return state;
}
