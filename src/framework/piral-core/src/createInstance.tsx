import { __assign } from 'tslib';
import { blazingStrategy, standardStrategy, createListener, isfunc } from 'piral-base';
import { defaultApiFactory, defaultDependencySelector, defaultModuleRequester } from './modules';
import { createGlobalState, createActions, includeActions } from './state';
import { createPiletOptions } from './helpers';
import { generateId } from './utils';
import type { PiralInstanceOptions, PiralInstance } from './types';

/**
 * Creates a new PiralInstance component, which can be used for
 * bootstrapping the application easily.
 *
 * @example
```jsx
const instance = createInstance({
  requestPilets() {
    return fetch(...);
  },
});

const app = (
  <Piral instance={instance}>
    <Define name="Layout" component={MyLayout} />
  </Piral>
);
render(app, document.querySelector('#app'));
```
 */
export function createInstance(config: PiralInstanceOptions = {}): PiralInstance {
  const {
    id = generateId(),
    state,
    actions,
    availablePilets = [],
    plugins,
    requestPilets = defaultModuleRequester,
    loaderConfig,
    async = false,
    shareDependencies = defaultDependencySelector,
    loadPilet,
    loaders,
    debug,
    apiFactory = defaultApiFactory,
  } = config;
  const globalState = createGlobalState(state);
  const events = createListener(globalState);
  const context = createActions(globalState, events);
  const definedPlugins = plugins || [];
  const usedPlugins = Array.isArray(definedPlugins) ? definedPlugins : [definedPlugins];
  const createApi = apiFactory(context, usedPlugins);
  const root = createApi({
    name: '_',
    version: '0',
    spec: 'v0',
    basePath: '',
    link: '',
    config: {},
    dependencies: {},
  });
  const options = createPiletOptions({
    context,
    createApi,
    loaders,
    loadPilet,
    availablePilets,
    loaderConfig,
    shareDependencies,
    strategy: isfunc(async) ? async : async ? blazingStrategy : standardStrategy,
    requestPilets,
    debug,
  });

  if (actions) {
    includeActions(context, actions);
  }

  context.options = options;

  return __assign(events, {
    id,
    createApi,
    context,
    root,
    options,
  });
}
