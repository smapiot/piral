import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from '../components/default';
import { defaultBreakpoints } from '../utils';
import { GlobalState, NestedPartial } from '../types';

export function createGlobalState<TState extends GlobalState>(state: NestedPartial<TState> = {}) {
  const globalState = Atom.of({
    feeds: {},
    forms: {},
    modules: [],
    ...state,
    app: {
      language: {
        selected: '',
        available: [],
      },
      layout: {
        current: 'desktop',
        breakpoints: defaultBreakpoints,
      },
      components: {
        Dashboard: DefaultDashboard,
        ErrorInfo: DefaultErrorInfo,
        Loader: DefaultLoader,
      },
      routes: {},
      trackers: [],
      data: {},
      modals: [],
      notifications: [],
      loading: false,
      ...state.app,
    },
    components: {
      extensions: {},
      menuItems: {},
      modals: {},
      pages: {},
      tiles: {},
      searchProviders: {},
      ...state.components,
    },
    user: {
      current: undefined,
      features: {},
      permissions: {},
      ...state.user,
    },
    search: {
      input: '',
      loading: false,
      results: [],
      ...state.search,
    },
  });

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
