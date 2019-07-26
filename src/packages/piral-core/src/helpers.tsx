import { AvailableDependencies } from 'react-arbiter';
import { createBrowserHistory } from 'history';
import { globalDependencies } from './modules';
import { defaultBreakpoints, getUserLocale, getCurrentLayout, defaultLayouts } from './utils';
import { DefaultDashboard, DefaultLoader, DefaultErrorInfo } from './components/default';
import {
  Append,
  Extend,
  GlobalStateOptions,
  NestedPartial,
  GlobalState,
  UnionToIntersection,
  ValuesOf,
  PiralCoreApi,
} from './types';

/**
 * Creates a dependency getter that sets the shared dependencies explicitly.
 * Overrides the potentially set shared dependencies from the Piral CLI, but
 * keeps all global dependencies such as react, react-dom, ...
 * @param dependencies The shared dependencies to declare.
 */
export function setSharedDependencies(sharedDependencies: AvailableDependencies) {
  const dependencies = {
    ...globalDependencies,
    ...sharedDependencies,
  };
  return () => dependencies;
}

/**
 * Creates an API extender from the given array of API declarations.
 * @param apis The APIs to use as source.
 */
export function extendApis<T extends Array<Append>>(
  apis: T,
): Extend<PiralCoreApi<UnionToIntersection<ReturnType<ValuesOf<T>>>> & UnionToIntersection<ReturnType<ValuesOf<T>>>> {
  return (init, target) =>
    apis
      .map(createApi => createApi(init, target))
      .reduce(
        (prev, curr) => ({
          ...curr,
          ...prev,
        }),
        init,
      );
}

/**
 * Sets up the initial state from the given options.
 * @param options The options for setting up the initial state.
 * @param state The optional parent state for deriving the defaults.
 */
export function setupState<TUser = {}>(
  options: GlobalStateOptions<TUser> = {},
  state: NestedPartial<GlobalState<TUser>> = {},
): NestedPartial<GlobalState<TUser>> {
  const {
    components: defaultComponentsState = {
      Dashboard: undefined,
      Loader: undefined,
      ErrorInfo: undefined,
      history: undefined,
    },
    language: defaultLanguageState = {
      available: undefined,
      selected: undefined,
    },
    layout: defaultLayoutState = {
      breakpoints: undefined,
      current: undefined,
    },
    routes: defaultRoutes = {},
    trackers: defaultTrackers = [],
  } = state.app || {};
  const {
    user,
    history = defaultComponentsState.history || createBrowserHistory(),
    breakpoints = defaultLayoutState.breakpoints || defaultBreakpoints,
    language = 'en',
    languages = defaultLanguageState.available || (language && [language]) || [],
    routes = {},
    trackers = [],
    Dashboard = defaultComponentsState.Dashboard || DefaultDashboard,
    Loader = defaultComponentsState.Loader || DefaultLoader,
    ErrorInfo = defaultComponentsState.ErrorInfo || DefaultErrorInfo,
  } = options;
  const [defaultLanguage = language] = languages;
  return {
    ...state,
    app: {
      ...state.app,
      language: {
        selected: defaultLanguageState.selected || getUserLocale(languages, defaultLanguage, language),
        available: languages,
      },
      layout: {
        current: defaultLayoutState.current || getCurrentLayout(breakpoints, defaultLayouts, 'desktop'),
        breakpoints,
      },
      components: {
        Dashboard,
        ErrorInfo,
        Loader,
        history,
      },
      routes: {
        ...defaultRoutes,
        ...routes,
      },
      trackers: [...defaultTrackers, ...trackers],
    },
    user: {
      ...state.user,
      ...user,
    },
  };
}
