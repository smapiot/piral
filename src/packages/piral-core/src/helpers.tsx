import { AvailableDependencies } from 'react-arbiter';
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
 */
export function setupState<TUser = {}>(options: GlobalStateOptions<TUser> = {}): NestedPartial<GlobalState<TUser>> {
  const {
    user,
    breakpoints = defaultBreakpoints,
    language = 'en',
    languages = (language && [language]) || [],
    routes = {},
    trackers = [],
    Dashboard = DefaultDashboard,
    Loader = DefaultLoader,
    ErrorInfo = DefaultErrorInfo,
  } = options;
  const [defaultLanguage = language] = languages;
  return {
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
      routes,
      trackers,
    },
    user,
  };
}
