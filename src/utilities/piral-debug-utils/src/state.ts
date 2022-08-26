import { useState, useEffect } from 'react';

const persistKey = 'dbg:persist-settings-data';
const persistSettings = !!localStorage.getItem(persistKey);

const defaultSetter = (name: string, value: string) => {
  sessionStorage.setItem(name, value);
};

const persistentSetter = (name: string, value: string) => {
  defaultSetter(name, value);
  const data = JSON.parse(localStorage.getItem(persistKey));
  data[name] = value;
  localStorage.setItem(persistKey, JSON.stringify(data));
};

if (persistSettings) {
  try {
    const settings = JSON.parse(localStorage.getItem(persistKey));

    Object.keys(settings).forEach((name) => {
      const value = settings[name];
      sessionStorage.setItem(name, value);
    });
  } catch {
    // invalid data
    localStorage.setItem(persistKey, '{}');
  }
}

export function enablePersistance() {
  const data: Record<string, string> = {};

  for (let i = 0; i < sessionStorage.length; i++) {
    const name = sessionStorage.key(i);
    const value = sessionStorage.getItem(name);
    data[name] = value;
  }

  localStorage.setItem(persistKey, JSON.stringify(data));
  return persistentSetter;
}

export function disablePersistance() {
  localStorage.removeItem(persistKey);
  return defaultSetter;
}

export const initialSetter = persistSettings ? persistentSetter : defaultSetter;

export const initialSettings = {
  viewState: sessionStorage.getItem('dbg:view-state') !== 'off',
  loadPilets: sessionStorage.getItem('dbg:load-pilets') === 'on',
  hardRefresh: sessionStorage.getItem('dbg:hard-refresh') === 'on',
  viewOrigins: sessionStorage.getItem('dbg:view-origins') === 'on',
  extensionCatalogue: sessionStorage.getItem('dbg:extension-catalogue') !== 'off',
  clearConsole: sessionStorage.getItem('dbg:clear-console') === 'on',
  persistSettings,
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

interface NavigateFunction {
  (path: string, state?: any): void;
}

let _navigate: NavigateFunction = undefined;

export function setNavigate(navigate: NavigateFunction) {
  _navigate = navigate;
}

export function navigate(path: string, state?: any) {
  _navigate?.(path, state);
}

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
