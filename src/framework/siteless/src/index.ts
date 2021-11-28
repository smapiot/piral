import { createLazyApi } from 'piral-lazy';
import { PiletLoader, PiletLoadingStrategy } from 'piral-base';
import {
  renderInstance,
  AnyComponent,
  PiletRequester,
  ComponentsState,
  ErrorComponentsState,
  PiralPlugin,
  PiralInstance,
  PiralConfiguration,
  PiralExtSettings,
  GlobalState,
  NestedPartial,
  PiralDefineActions,
  withApi,
} from 'piral';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends SitelessApi {}
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

export type GenericComponents<T> = Partial<
  {
    [P in keyof T]: T[P] extends React.ComponentType<infer C> ? AnyComponent<C> : T[P];
  }
>;

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
    plugins: [...plugins, createSitelessApi(), createLazyApi()],
    async: strategy,
    settings,
    state,
    selector,
  });
};
