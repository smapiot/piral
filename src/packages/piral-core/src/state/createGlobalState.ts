import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { DefaultErrorInfo, DefaultLoader, DefaultRouter, DefaultLayout } from '../components';
import { GlobalState, NestedPartial } from '../types';

function extend<T>(defaultState: T, customState: NestedPartial<T>) {
  for (const key of Object.keys(customState)) {
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
      loading: false,
      layout: 'desktop',
    },
    components: {
      ErrorInfo: DefaultErrorInfo,
      Loader: DefaultLoader,
      Router: DefaultRouter,
      Layout: DefaultLayout,
    },
    registry: {
      extensions: {},
      pages: {},
    },
    routes: {},
    data: {},
    portals: {},
    modules: [],
  };

  const globalState = Atom.of(extend(defaultState, customState));

  if (process.env.NODE_ENV === 'development') {
    addChangeHandler(globalState, 'debugging', ({ current, previous }) => {
      const action = new Error().stack.split('\n')[6].replace(/^\s+at\s+Atom\./, '');
      console.group(
        `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
        'color: gray; font-weight: lighter;',
        'color: black; font-weight: bold;',
      );
      console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
      console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
      console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
      console.groupEnd();
    });
  }

  return globalState;
}
