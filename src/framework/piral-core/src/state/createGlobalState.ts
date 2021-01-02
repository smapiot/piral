import { Atom } from '@dbeining/react-atom';
import { BrowserRouter } from 'react-router-dom';
import { DefaultErrorInfo, DefaultLoadingIndicator, DefaultLayout } from '../components';
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
  const defaultState: GlobalState = {
    app: {
      error: undefined,
      loading: typeof window !== 'undefined',
      layout: 'desktop',
    },
    components: {
      ErrorInfo: DefaultErrorInfo,
      LoadingIndicator: DefaultLoadingIndicator,
      Router: BrowserRouter,
      Layout: DefaultLayout,
    },
    errorComponents: {},
    registry: {
      extensions: {},
      pages: {},
      wrappers: {},
    },
    routes: {},
    data: {},
    portals: {},
    modules: [],
  };

  return Atom.of(extend(defaultState, customState));
}
