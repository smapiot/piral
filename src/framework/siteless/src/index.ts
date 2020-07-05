import { createLazyApi } from 'piral-lazy';
import { PiletLoader, PiletLoadingStrategy } from 'piral-base';
import {
  renderInstance,
  PiletRequester,
  ComponentsState,
  ErrorComponentsState,
  Extend,
  PiralInstance,
  PiralConfiguration,
  PiralExtSettings,
  GlobalState,
  NestedPartial,
  PiralDefineActions,
} from 'piral';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends SitelessApi { }
}

declare global {
  interface Window {
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

export interface SitelessOptions {
  /**
   * Sets an optional middleware for adjusting the configuration.
   * @default cfg => cfg
   */
  middleware?: (config: PiralConfiguration) => PiralConfiguration;
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
  plugins?: Array<Extend>;
}

export interface SitelessApi {
  /**
   * Sets layout components in the application.
   * @param components The components to define.
   */
  setLayout(components: Partial<ComponentsState>): void;
  /**
   * Sets errors components in the application.
   * @param errors The error handlers to define.
   */
  setErrors(errors: Partial<ErrorComponentsState>): void;
}

function createSitelessApi(): Extend<SitelessApi> {
  return context => ({
    setErrors(errors) {
      context.dispatch(state => ({
        ...state,
        errorComponents: {
          ...state.errorComponents,
          ...errors,
        },
      }));
    },
    setLayout(components) {
      context.dispatch(state => ({
        ...state,
        components: {
          ...state.components,
          ...components,
        },
      }));
    },
  });
}

window.initializePiral = (requestPilets, selector = document.querySelector('#app'), options = {}) => {
  const { actions, errors, layout, loadPilet, middleware, plugins = [], settings, state, strategy } = options;
  return renderInstance({
    actions,
    errors,
    layout,
    loadPilet,
    middleware,
    requestPilets,
    extendApi: [...plugins, createSitelessApi(), createLazyApi()],
    async: strategy,
    settings,
    state,
    selector,
  });
};
