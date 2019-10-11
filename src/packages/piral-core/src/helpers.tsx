import { AvailableDependencies } from 'react-arbiter';
import { createBrowserHistory } from 'history';
import { globalDependencies, getLocalDependencies } from './modules';
import { DefaultLoader, DefaultErrorInfo } from './components/default';
import { GlobalStateOptions, NestedPartial, GlobalState } from './types';

/**
 * Creates a dependency getter that sets the shared dependencies explicitly.
 * Overrides the potentially set shared dependencies from the Piral CLI, but
 * keeps all global dependencies such as react, react-dom, ...
 * @param sharedDependencies The shared dependencies to declare.
 */
export function setSharedDependencies(sharedDependencies: AvailableDependencies) {
  const dependencies = {
    ...globalDependencies,
    ...sharedDependencies,
  };
  return () => dependencies;
}

/**
 * Creates a dependency getter that extends the shared dependencies with additional dependencies.
 * @param additionalDependencies The additional dependencies to declare.
 */
export function extendSharedDependencies(additionalDependencies: AvailableDependencies) {
  const dependencies = {
    ...getLocalDependencies(),
    ...additionalDependencies,
  };
  return () => dependencies;
}

/**
 * Sets up the initial state from the given options.
 * @param options The options for setting up the initial state.
 * @param state The optional parent state for deriving the defaults.
 */
export function setupState(
  options: GlobalStateOptions = {},
  state: NestedPartial<GlobalState> = {},
): NestedPartial<GlobalState> {
  const {
    components: defaultComponentsState = {
      Loader: undefined,
      ErrorInfo: undefined,
      history: undefined,
    },
    layout: defaultLayoutState = 'desktop',
    routes: defaultRoutes = {},
  } = state.app || {};
  const {
    history = defaultComponentsState.history || createBrowserHistory(),
    routes = {},
    Loader = defaultComponentsState.Loader || DefaultLoader,
    ErrorInfo = defaultComponentsState.ErrorInfo || DefaultErrorInfo,
  } = options;
  return {
    ...state,
    app: {
      ...state.app,
      layout: defaultLayoutState,
      components: {
        ErrorInfo,
        Loader,
        history,
      },
      routes: {
        ...defaultRoutes,
        ...routes,
      },
    },
  };
}
