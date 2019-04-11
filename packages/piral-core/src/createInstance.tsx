import * as React from 'react';
import { withRecall, ArbiterModule, DependencyGetter, isfunc } from 'react-arbiter';
import { Portal, PortalProps } from './components';
import { createApi, getLocalDependencies, createListener, globalDependencies } from './modules';
import { createGlobalState, createActions, StateContext, GlobalStateOptions } from './state';
import { PiralCoreApi, PiralApi, EventEmitter, ScaffoldPlugin, Extend, ModuleRequester } from './types';

function defaultModuleRequester() {
  return Promise.resolve([]);
}

function defaultApiExtender<TApi>(value: PiralCoreApi<TApi>): PiralApi<TApi> {
  return value as any;
}

function getExtender(plugins: Array<ScaffoldPlugin>): ScaffoldPlugin {
  const extenders = plugins.filter(isfunc);
  return container => {
    extenders.forEach(extender => {
      container = extender(container);
    });
    return container;
  };
}

export interface PiralConfiguration<TApi> extends GlobalStateOptions {
  /**
   * Function to extend the API creator with some additional functionality.
   */
  extendApi?: Extend<TApi>;
  /**
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestModules?: ModuleRequester;
  /**
   * Function to get the dependencies for a given module.
   */
  getDependencies?: DependencyGetter;
  /**
   * Determines the modules, which are available already from the start 🚀.
   * The given modules are all already evaluated.
   * This can be used for customization or for debugging purposes.
   */
  availableModules?: Array<ArbiterModule<PiralApi<TApi>>>;
  /**
   * Plugins for extending the core portal functionality.
   */
  plugins?: Array<ScaffoldPlugin>;
}

export type PiralInstance = React.SFC<PortalProps> & EventEmitter;

/**
 * Creates a new PiralInstance component, which can be used for
 * bootstrapping the application easily.
 *
 * @example
```tsx
const Piral = createInstance({
  requestModules() {
    return fetch(...);
  },
});

const App: React.SFC = () => <Piral>{content => <Layout>{content}</Layout>}</Piral>;
render(<App />, document.querySelector('#app'));
```
 */
export function createInstance<TApi>({
  availableModules,
  extendApi = defaultApiExtender,
  requestModules = defaultModuleRequester,
  getDependencies = getLocalDependencies,
  plugins = [],
  ...options
}: PiralConfiguration<TApi>): PiralInstance {
  const extender = getExtender(plugins);
  const state = createGlobalState(options);
  const container = extender({
    context: {
      ...createActions(state),
      state,
    },
    events: createListener(),
    getDependencies,
    extendApi,
    requestModules,
    availableModules,
  });

  const RecallPortal = withRecall<PortalProps, TApi>(Portal, {
    modules: container.availableModules,
    getDependencies: container.getDependencies,
    dependencies: globalDependencies,
    fetchModules() {
      return container.requestModules();
    },
    createApi(target) {
      return createApi(target, container);
    },
  });

  const piralInstance: React.SFC<PortalProps> = props => (
    <StateContext.Provider value={container.context}>
      <RecallPortal {...props} />
    </StateContext.Provider>
  );

  return Object.assign(piralInstance, container.events);
}
