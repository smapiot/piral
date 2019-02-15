import * as React from 'react';
import { withRecall, ArbiterModule, DependencyGetter } from 'react-arbiter';
import { Portal, PortalProps } from './components';
import { createApi, getLocalDependencies, createListener, globalDependencies } from './modules';
import { createGlobalState, createActions, StateContext, GlobalStateOptions } from './state';
import { PortalBaseApi, PortalApi, EventEmitter, ScaffoldPlugin, Extend, ModuleRequester } from './types';

function defaultModuleRequester() {
  return Promise.resolve([]);
}

function defaultApiExtender<TApi>(value: PortalBaseApi<TApi>): PortalApi<TApi> {
  return value as any;
}

function getExtender(plugins: Array<ScaffoldPlugin>): ScaffoldPlugin {
  const extenders = plugins.filter(m => typeof m === 'function');
  return container => {
    extenders.forEach(extender => {
      container = extender(container);
    });
    return container;
  };
}

export interface PortalInstanceOptions<TApi> extends GlobalStateOptions {
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
  availableModules?: Array<ArbiterModule<PortalApi<TApi>>>;
  /**
   * Plugins for extending the core portal functionality.
   */
  plugins?: Array<ScaffoldPlugin>;
}

export type PortalInstance = React.SFC<PortalProps> & EventEmitter;

/**
 * Creates a new PortalInstance component, which can be used for
 * bootstrapping the application easily.
 *
 * @example
```tsx
const Portal = createInstance({
  requestModules() {
    return fetch(...);
  },
});

const App: React.SFC = () => <Portal>{content => <Layout>{content}</Layout>}</Portal>;
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
}: PortalInstanceOptions<TApi>): PortalInstance {
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

  const PortalInstance: React.SFC<PortalProps> = props => (
    <StateContext.Provider value={container.context}>
      <RecallPortal {...props} />
    </StateContext.Provider>
  );

  return Object.assign(PortalInstance, container.events);
}
