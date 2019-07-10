import * as React from 'react';
import { withRecall, ArbiterModule, DependencyGetter } from 'react-arbiter';
import { createApi, getLocalDependencies, createListener, globalDependencies } from './modules';
import { createGlobalState, createActions, StateContext } from './state';
import { Portal, PortalProps } from './components';
import { PiralApi, EventEmitter, Extend, PiletRequester, GlobalState, NestedPartial, PiralCoreApi } from './types';

function defaultModuleRequester() {
  return Promise.resolve([]);
}

function defaultApiExtender<TApi>(value: PiralCoreApi<TApi>): PiralApi<TApi> {
  return value as any;
}

declare global {
  interface NodeModule {
    hot?: {
      accept(errHandler?: (err: any) => void): void;
      dispose(callback: (data: any) => void): void;
    };
  }
}

export interface PiralConfiguration<TApi, TState extends GlobalState = GlobalState> {
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   */
  extendApi?: Extend<PiralCoreApi<TApi>, PiralApi<TApi>>;
  /*
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestPilets?: PiletRequester;
  /**
   * Function to get the dependencies for a given module.
   */
  getDependencies?: DependencyGetter;
  /**
   * Determines the modules, which are available already from the start 🚀.
   * The given modules are all already evaluated.
   * This can be used for customization or for debugging purposes.
   */
  availablePilets?: Array<ArbiterModule<PiralApi<TApi>>>;
  /**
   * Determines that pilets are loaded asynchronously, essentially showing the
   * app right away without waiting for the pilets to load and evaluate.
   */
  async?: boolean;
  /**
   * Optionally, sets up the initial state of the application.
   */
  state?: NestedPartial<TState>;
}

/**
 * The PiralInstance component, which is a React functional component combined with an event emitter.
 */
export type PiralInstance = React.FC<PortalProps> & EventEmitter;

/**
 * Creates a new PiralInstance component, which can be used for
 * bootstrapping the application easily.
 *
 * @example
```tsx
const Piral = createInstance({
  requestPilets() {
    return fetch(...);
  },
});

const App: React.FC = () => <Piral>{content => <Layout>{content}</Layout>}</Piral>;
render(<App />, document.querySelector('#app'));
```
 */
export function createInstance<TApi, TState extends GlobalState = GlobalState>(
  config: PiralConfiguration<TApi, TState>,
): PiralInstance {
  const {
    state,
    availablePilets,
    extendApi = defaultApiExtender,
    requestPilets = defaultModuleRequester,
    getDependencies = getLocalDependencies,
    async = false,
  } = config;
  const globalState = createGlobalState(state);
  const container = {
    context: {
      ...createActions(globalState),
      state: globalState,
    },
    events: createListener(),
    extendApi,
  };

  if (process.env.DEBUG_PILET) {
    const { setup } = require(process.env.DEBUG_PILET);
    availablePilets.push({
      content: '',
      dependencies: {},
      name: process.env.BUILD_PCKG_NAME || 'dbg',
      version: process.env.BUILD_PCKG_VERSION || '1.0.0',
      hash: '',
      setup,
    });
  }

  const RecallPortal = withRecall<PortalProps, TApi>(Portal, {
    modules: availablePilets,
    getDependencies,
    dependencies: globalDependencies,
    fetchModules() {
      const promise = requestPilets();

      if (process.env.DEBUG_PILET) {
        return promise.catch(() => []);
      }

      return promise;
    },
    createApi(target) {
      return createApi(target, container);
    },
    async,
  });

  const PiralInstance: React.FC<PortalProps> = props => (
    <StateContext.Provider value={container.context}>
      <RecallPortal {...props} />
    </StateContext.Provider>
  );
  PiralInstance.displayName = 'Piral';
  return Object.assign(PiralInstance, container.events);
}
