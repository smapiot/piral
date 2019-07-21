import * as React from 'react';
import { withRecall, ArbiterModuleMetadata } from 'react-arbiter';
import { Portal } from './components';
import { createGlobalState, createActions, StateContext } from './state';
import { createApi, getLocalDependencies, createListener, globalDependencies } from './modules';
import { GlobalState, PiralCoreApi, PiralConfiguration, PortalProps, PiralInstance } from './types';

function defaultModuleRequester(): Promise<Array<ArbiterModuleMetadata>> {
  return Promise.resolve([]);
}

function defaultApiExtender<TApi>(value: PiralCoreApi<TApi>): TApi {
  return value as any;
}

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
export function createInstance<TApi, TState extends GlobalState = GlobalState, TActions extends {} = {}>(
  config: PiralConfiguration<TApi, TState, TActions>,
): PiralInstance {
  const {
    state,
    availablePilets,
    extendApi = defaultApiExtender,
    requestPilets = defaultModuleRequester,
    getDependencies = getLocalDependencies,
    async = false,
    actions,
  } = config;
  const globalState = createGlobalState(state);
  const events = createListener(globalState);
  const container = {
    context: createActions(globalState, events, actions),
    events,
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
      events.emit('load-start', {});
      let promise = requestPilets();

      if (process.env.DEBUG_PILET) {
        promise = promise.catch(() => []);
      }

      promise.then(modules =>
        events.emit('load-end', {
          modules,
        }),
      );

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
  return Object.assign(PiralInstance, events);
}
