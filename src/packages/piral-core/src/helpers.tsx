import { defaultBreakpoints, getUserLocale, getCurrentLayout, defaultLayouts } from './utils';
import { DefaultDashboard, DefaultLoader, DefaultErrorInfo } from './components/default';
import { PiralApi, Append, Extend, GlobalStateOptions, NestedPartial, GlobalState } from './types';

/**
 * Creates an API extender from the given array of API declarations.
 * @param apis The APIs to use as source.
 */
export function extendApis<TApi>(apis: Array<Append<TApi>>): Extend<TApi> {
  return (init, target) => {
    let api = init as PiralApi<TApi>;

    for (const createApi of apis) {
      api = {
        ...createApi(api, target),
        ...api,
      };
    }

    return api;
  };
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
