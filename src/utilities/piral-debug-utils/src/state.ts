import { useState, useEffect } from 'react';

export const initialSettings = {
  viewState: sessionStorage.getItem('dbg:view-state') !== 'off',
  loadPilets: sessionStorage.getItem('dbg:load-pilets') === 'on',
  hardRefresh: sessionStorage.getItem('dbg:hard-refresh') === 'on',
  viewOrigins: sessionStorage.getItem('dbg:view-origins') === 'on',
  extensionCatalogue: sessionStorage.getItem('dbg:extension-catalogue') !== 'off',
  cataloguePath: '/$debug-extension-catalogue',
};

export interface PiralDebugState {
  visualize: {
    active: boolean;
    force: boolean;
  };
  catalogue: {
    active: boolean;
    path: string;
  };
  route:
    | {
        path: string;
        state?: any;
      }
    | undefined;
}

const listeners: Array<() => void> = [];

let state: PiralDebugState = {
  visualize: {
    active: initialSettings.viewOrigins,
    force: false,
  },
  catalogue: {
    active: initialSettings.extensionCatalogue,
    path: initialSettings.cataloguePath,
  },
  route: undefined,
};

export function setState(dispatch: (arg: PiralDebugState) => PiralDebugState) {
  const newState = dispatch(state);

  if (newState !== state) {
    state = newState;
    listeners.forEach((listener) => listener());
  }
}

export function getState() {
  return state;
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
  useEffect(() => subscribe(select, setState), []);
  return state;
}
