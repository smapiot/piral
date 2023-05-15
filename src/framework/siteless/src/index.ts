import * as piralBase from 'piral-base';
import * as piralCore from 'piral-core';
import { createElement, ComponentType } from 'react';
import { render } from 'react-dom';
import { createLazyApi } from 'piral-lazy';
import {
  requireModule,
  createInstance,
  PiletLoader,
  PiletLoadingStrategy,
  AnyComponent,
  PiletRequester,
  ComponentsState,
  ErrorComponentsState,
  PiralPlugin,
  PiralInstance,
  PiralExtSettings,
  GlobalState,
  NestedPartial,
  PiralDefineActions,
  withApi,
  useGlobalState,
  Piral,
  PiralInstanceOptions,
  createStandardApi,
} from 'piral';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends SitelessApi {}
}

declare global {
  interface Window {
    /**
     * Loads a shared dependency.
     * @param moduleName The name of the module to require.
     */
    require(moduleName: string): any;
    /**
     * Initializes the Piral app shell.
     * @param requestPilets Defines how pilets should be requested.
     * @param selector Sets the optional mounting DOM element selector.
     * @param options Sets the auxiliary options.
     */
    initializePiral(
      requestPilets: PiletRequester,
      selector?: string | Element,
      options?: SitelessOptions,
    ): PiralInstance;
  }
}

export type GenericComponents<T> = Partial<
  {
    [P in keyof T]: T[P] extends ComponentType<infer C> ? AnyComponent<C> : T[P];
  }
>;

export interface SitelessOptions {
  /**
   * Sets an optional middleware for adjusting the configuration.
   * @default cfg => cfg
   */
  middleware?: (config: PiralInstanceOptions) => PiralInstanceOptions;
  /**
   * Customizes the plugin settings.
   */
  settings?: PiralExtSettings;
  /**
   * Defines how the (initial) layout looks like.
   */
  layout?: Partial<ComponentsState>;
  /**
   * Defines how the (initial) errors looks like.
   */
  errors?: Partial<ErrorComponentsState>;
  /**
   * Optionally, sets up the initial state of the application 📦.
   */
  state?: NestedPartial<GlobalState>;
  /**
   * Optionally, sets up some initial custom actions ⚡️.
   */
  actions?: PiralDefineActions;
  /**
   * Function to define how to load a pilet given its metadata.
   */
  loadPilet?: PiletLoader;
  /**
   * Determines that pilets are loaded asynchronously, essentially showing the
   * app right away without waiting for the pilets to load and evaluate.
   */
  strategy?: PiletLoadingStrategy;
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   */
  plugins?: Array<PiralPlugin>;
}

export interface SitelessApi {
  /**
   * Sets layout components in the application.
   * @param components The components to define.
   */
  setLayout(components: GenericComponents<ComponentsState>): void;
  /**
   * Sets errors components in the application.
   * @param errors The error handlers to define.
   */
  setErrors(errors: GenericComponents<ErrorComponentsState>): void;
  /**
   * Gets a snapshot of the current global state.
   * @param select The selection function to obtain the desired slice.
   */
  readState<T>(select: (state: GlobalState) => T): T;
  /**
   * Connects to the global state.
   * @param select The selection function to obtain the desired slice.
   */
  useState<T>(select: (state: GlobalState) => T): T;
}

function createSitelessApi(): PiralPlugin<SitelessApi> {
  return (context) => (api) => ({
    setErrors(newErrorComponents) {
      context.dispatch((state) => {
        const errorComponents = {
          ...state.errorComponents,
        };

        for (const name of Object.keys(newErrorComponents)) {
          errorComponents[name] = withApi(context, newErrorComponents[name], api, 'unknown');
        }

        return {
          ...state,
          errorComponents,
        };
      });
    },
    setLayout(newComponents) {
      context.dispatch((state) => {
        const components = {
          ...state.components,
        };

        for (const name of Object.keys(newComponents)) {
          components[name] = withApi(context, newComponents[name], api, 'unknown');
        }

        return {
          ...state,
          components,
        };
      });
    },
    readState(select) {
      return context.readState(select);
    },
    useState(select) {
      return useGlobalState(select);
    },
  });
}

function noChange<T>(config: T) {
  return config;
}

//@ts-ignore
window.require = requireModule;

window.initializePiral = (requestPilets, selector = document.querySelector('#app'), options = {}) => {
  const {
    actions,
    errors,
    layout,
    loadPilet,
    settings,
    state,
    strategy,
    middleware = noChange,
    plugins: customPlugins = [],
  } = options;
  const target = selector instanceof Element ? selector : document.querySelector(selector);
  const plugins = [...createStandardApi(settings), createSitelessApi(), createLazyApi(), ...customPlugins];
  const instance = createInstance(
    middleware({
      actions,
      loadPilet,
      requestPilets,
      shareDependencies(deps) {
        return {
          ...deps,
          'piral-base': piralBase,
          'piral-core': piralCore,
        };
      },
      plugins,
      async: strategy,
      state: {
        ...state,
        components: {
          ...state?.components,
          ...layout,
        },
        errorComponents: {
          ...state?.errorComponents,
          ...errors,
        },
      },
    }),
  );
  render(createElement(Piral, { instance }), target);
  return instance;
};
