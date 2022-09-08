import { useState, useEffect } from 'react';

export const settingsKeys = {
  viewState: 'dbg:view-state',
  loadPilets: 'dbg:load-pilets',
  hardRefresh: 'dbg:hard-refresh',
  viewOrigins: 'dbg:view-origins',
  extensionCatalogue: 'dbg:extension-catalogue',
  clearConsole: 'dbg:clear-console',
  persistSettings: 'dbg:persist-settings-data',
};

const persistKey = settingsKeys.persistSettings;
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
  const validKeys = Object.keys(settingsKeys).map((m) => settingsKeys[m]);

  for (let i = 0; i < sessionStorage.length; i++) {
    const name = sessionStorage.key(i);

    if (validKeys.includes(name)) {
      const value = sessionStorage.getItem(name);
      data[name] = value;
    }
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
  viewState: sessionStorage.getItem(settingsKeys.viewState) !== 'off',
  loadPilets: sessionStorage.getItem(settingsKeys.loadPilets) === 'on',
  hardRefresh: sessionStorage.getItem(settingsKeys.hardRefresh) === 'on',
  viewOrigins: sessionStorage.getItem(settingsKeys.viewOrigins) === 'on',
  extensionCatalogue: sessionStorage.getItem(settingsKeys.extensionCatalogue) !== 'off',
  clearConsole: sessionStorage.getItem(settingsKeys.clearConsole) === 'on',
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
