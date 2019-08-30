import * as React from 'react';
import { withRecall, ArbiterModuleMetadata, ApiCreator, createProgressiveStrategy } from 'react-arbiter';
import { Portal } from './components';
import { createGlobalState, createActions, StateContext } from './state';
import { createCoreApi, getLocalDependencies, createListener, globalDependencies } from './modules';
import { GlobalState, PiralCoreApi, PiralConfiguration, PortalProps, PiralInstance, PiralContainer } from './types';

function defaultModuleRequester(): Promise<Array<ArbiterModuleMetadata>> {
  return Promise.resolve([]);
}

function defaultApiExtender<TApi>(value: PiralCoreApi<TApi>): TApi {
  return value as any;
}

function defaultApiCreator<TApi>(container: PiralContainer<TApi>): ApiCreator<TApi> {
  return target => createCoreApi(target, container);
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
): PiralInstance<TApi, TActions> {
  const {
    state,
    availablePilets = [],
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
      name: process.env.BUILD_PCKG_NAME || 'dbg',
      version: process.env.BUILD_PCKG_VERSION || '1.0.0',
      hash: '',
      setup,
    });
  }

  const createApi = defaultApiCreator(container);
  const RecallPortal = withRecall<PortalProps, TApi>(Portal, {
    modules: availablePilets,
    getDependencies,
    strategy: createProgressiveStrategy(async),
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
    createApi,
  });

  const App: React.FC<PortalProps> = props => (
    <StateContext.Provider value={container.context}>
      <RecallPortal {...props} />
    </StateContext.Provider>
  );
  App.displayName = 'Piral';

  return {
    ...events,
    App,
    createApi,
    actions: container.context,
    root: createApi({
      name: 'root',
      version: process.env.BUILD_PCKG_VERSION || '1.0.0',
      hash: '',
    }),
  };
}
