import { renderInstance, PiletRequester, ComponentsState, ErrorComponentsState, Extend, PiralInstance } from 'piral';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends SitelessApi {}
}

declare global {
  interface Window {
    /**
     * Initializes the Piral app shell.
     * @param requestPilets Defines how pilets should be requested.
     * @param selector Sets the optional mounting DOM element selector.
     */
    initializePiral(requestPilets: PiletRequester, selector?: string | Element): PiralInstance;
  }
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

window.initializePiral = (requestPilets, selector = document.querySelector('#app')) =>
  renderInstance({
    requestPilets,
    extendApi: [createSitelessApi()],
    selector,
  });
