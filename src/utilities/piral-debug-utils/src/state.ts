import { DefaultDebugSettings } from './types';

export const settingsKeys = {
  viewState: 'dbg:view-state',
  loadPilets: 'dbg:load-pilets',
  hardRefresh: 'dbg:hard-refresh',
  viewOrigins: 'dbg:view-origins',
  extensionCatalogue: 'dbg:extension-catalogue',
  clearConsole: 'dbg:clear-console',
  persistSettings: 'dbg:persist-settings-data',
  errorOverlay: 'dbg:error-overlay',
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

function getValue(key: string, defaultValue: boolean, fallbackValue: boolean) {
  const value = sessionStorage.getItem(key);
  const actualValue = value === 'on';

  if (['on', 'off'].includes(value)) {
    return actualValue;
  }

  const currentValue = typeof defaultValue === 'boolean' ? defaultValue : fallbackValue;

  if (actualValue !== currentValue) {
    sessionStorage.setItem(key, currentValue ? 'on' : 'off');
  }

  return currentValue;
}

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

export function getInitialSettings(defaultValues: DefaultDebugSettings) {
  return {
    viewState: getValue(settingsKeys.viewState, defaultValues.viewState, true),
    loadPilets: getValue(settingsKeys.loadPilets, defaultValues.loadPilets, false),
    hardRefresh: getValue(settingsKeys.hardRefresh, defaultValues.hardRefresh, false),
    viewOrigins: getValue(settingsKeys.viewOrigins, defaultValues.viewOrigins, false),
    extensionCatalogue: getValue(settingsKeys.extensionCatalogue, defaultValues.extensionCatalogue, true),
    clearConsole: getValue(settingsKeys.clearConsole, defaultValues.clearConsole, false),
    errorOverlay: getValue(settingsKeys.errorOverlay, defaultValues.errorOverlay, true),
    persistSettings,
    cataloguePath: '/$debug-extension-catalogue',
  };
}
