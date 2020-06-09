import { blazingStrategy, standardStrategy, isfunc } from 'piral-base';
import { getLocalDependencies, defaultApiCreator, defaultModuleRequester } from './modules';
import { createGlobalState, createActions, includeActions } from './state';
import { createPiletOptions } from './helpers';
import { createListener } from './utils';
import { PiralConfiguration, PiralInstance } from './types';

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
export function createInstance(config: PiralConfiguration = {}): PiralInstance {
  const {
    state,
    actions,
    availablePilets = [],
    extendApi = [],
    requestPilets = defaultModuleRequester,
    fetchDependency,
    getDependencies = getLocalDependencies,
    async = false,
  } = config;
  const globalState = createGlobalState(state);
  const events = createListener(globalState);
  const context = createActions(globalState, events);
  const createApi = defaultApiCreator(context, Array.isArray(extendApi) ? extendApi : [extendApi]);
  const root = createApi({
    name: 'root',
    version: process.env.BUILD_PCKG_VERSION || '1.0.0',
    hash: '',
  });
  const options = createPiletOptions({
    context,
    createApi,
    availablePilets,
    fetchDependency,
    getDependencies,
    strategy: isfunc(async) ? async : async ? blazingStrategy : standardStrategy,
    requestPilets,
  });

  if (actions) {
    includeActions(context, actions);
  }

  return {
    ...events,
    createApi,
    context,
    root,
    options,
  };
}
