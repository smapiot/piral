import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { BrowserRouter } from 'react-router-dom';
import { DefaultErrorInfo, DefaultLoadingIndicator, DefaultLayout } from '../components';
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
      LoadingIndicator: DefaultLoadingIndicator,
      Router: BrowserRouter,
      Layout: DefaultLayout,
    },
    errorComponents: {},
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

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL !== undefined) {
    addChangeHandler(globalState, 'debugging', ({ current, previous }) => {
      const viewState = sessionStorage.getItem('dbg:view-state') !== 'off';

      if (viewState) {
        const infos = new Error().stack;

        if (infos) {
          // Chrome, Firefox, ... (full capability)
          const action = infos.split('\n')[6].replace(/^\s+at\s+Atom\./, '');
          console.group(
            `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
            'color: gray; font-weight: lighter;',
            'color: black; font-weight: bold;',
          );
          console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
          console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
          console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
          console.groupEnd();
        } else {
          // IE 11, ... (does not know colors etc.)
          console.log('Changed state', previous, current);
        }
      }
    });
  }

  return globalState;
}
