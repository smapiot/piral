import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from '../components/default';
import { getCurrentLayout, defaultBreakpoints, defaultLayouts, getUserLocale } from '../utils';
import { GlobalState, LayoutBreakpoints, Setup, AppComponents, UserState } from '../types';

export interface GlobalStateOptions<TState extends GlobalState<TUser>, TUser = {}> extends Partial<AppComponents> {
  /**
   * Function to extend the global state with some additional information.
   */
  setupState?: Setup<TState, TUser>;
  /**
   * Sets the available languages.
   * By default, only the default language is used.
   */
  languages?: Array<string>;
  /**
   * Sets the default language.
   * By default, English is used.
   * @default 'en'
   */
  language?: string;
  /**
   * Sets the additional / initial routes to register.
   */
  routes?: Record<string, ComponentType<RouteComponentProps>>;
  /**
   * Sets the available trackers to register.
   */
  trackers?: Array<ComponentType<RouteComponentProps>>;
  /**
   * Sets the available layout breakpoints.
   */
  breakpoints?: LayoutBreakpoints;
  /**
   * Sets the initially available user information.
   */
  user?: UserState<TUser>;
}

function defaultInitializer<TState extends GlobalState, TUser = {}>(state: GlobalState): TState {
  return state as TState;
}

export function createGlobalState<TState extends GlobalState>({
  user = {
    current: undefined,
    features: {},
    permissions: {},
  },
  breakpoints = defaultBreakpoints,
  setupState = defaultInitializer,
  language = 'en',
  languages = (language && [language]) || [],
  routes = {},
  trackers = [],
  Dashboard = DefaultDashboard,
  Loader = DefaultLoader,
  ErrorInfo = DefaultErrorInfo,
}: GlobalStateOptions<TState> = {}) {
  const [defaultLanguage = language] = languages;
  const initialState = setupState({
    app: {
      language: {
        selected: getUserLocale(languages, defaultLanguage, language),
        available: languages,
      },
      layout: {
        current: getCurrentLayout(breakpoints, defaultLayouts, 'desktop'),
        breakpoints,
      },
      components: {
        Dashboard,
        ErrorInfo,
        Loader,
      },
      data: {},
      modals: [],
      notifications: [],
      routes,
      trackers,
    },
    components: {
      extensions: {},
      menuItems: {},
      modals: {},
      pages: {},
      tiles: {},
      searchProviders: {},
    },
    feeds: {},
    forms: {},
    user,
    search: {
      input: '',
      loading: false,
      results: [],
    },
  });
  const globalState = Atom.of(initialState);

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
