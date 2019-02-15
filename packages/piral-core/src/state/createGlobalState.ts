import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from '../components/default';
import { getCurrentLayout, defaultBreakpoints, defaultLayouts, getUserLocale } from '../utils';
import {
  GlobalState,
  LocalizationMessages,
  LayoutBreakpoints,
  DashboardProps,
  LoaderProps,
  ErrorInfoProps,
  Dict,
} from '../types';

export interface GlobalStateOptions {
  language?: string;
  routes?: Dict<ComponentType<RouteComponentProps>>;
  translations?: LocalizationMessages;
  breakpoints?: LayoutBreakpoints;
  Dashboard?: ComponentType<DashboardProps>;
  Loader?: ComponentType<LoaderProps>;
  ErrorInfo?: ComponentType<ErrorInfoProps>;
}

export function createGlobalState({
  breakpoints = defaultBreakpoints,
  translations = {},
  routes = {},
  language,
  Dashboard = DefaultDashboard,
  Loader = DefaultLoader,
  ErrorInfo = DefaultErrorInfo,
}: GlobalStateOptions = {}) {
  const available = Object.keys(translations);
  const globalState = Atom.of<GlobalState>({
    app: {
      language: {
        selected: getUserLocale(available, available[0] || 'en', language),
        available,
        translations,
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
    },
    components: {
      extensions: {},
      menuItems: {},
      modals: {},
      pages: {},
      tiles: {},
    },
    feeds: {},
    user: {
      current: undefined,
      features: {},
      permissions: {},
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    addChangeHandler(globalState, 'debugging', ({ current, previous }) => {
      const action = new Error().stack.split('\n')[6].replace(/^\s+at\s+Atom\./, '');
      console.group(
        `%c Portal State Change %c ${new Date().toLocaleTimeString()}`,
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
