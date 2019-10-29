import * as React from 'react';
import { withRecall, blazingStrategy, standardStrategy, isfunc } from 'react-arbiter';
import { getLocalDependencies, globalDependencies, defaultApiCreator, defaultModuleRequester } from './modules';
import { createGlobalState, createActions, StateContext } from './state';
import { PiralView, Mediator, MediatorProps, ResponsiveLayout } from './components';
import { createListener } from './utils';
import { PiletApi, PiralConfiguration, PortalProps, PiralInstance } from './types';

/**
 * Creates a new PiralInstance component, which can be used for
 * bootstrapping the application easily.
 *
 * @example
```tsx
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
    availablePilets = [],
    extendApi = [],
    requestPilets = defaultModuleRequester,
    getDependencies = getLocalDependencies,
    async = false,
  } = config;
  const globalState = createGlobalState(state);
  const events = createListener(globalState);
  const context = createActions(globalState, events);

  const createApi = defaultApiCreator(context, Array.isArray(extendApi) ? extendApi : [extendApi]);
  const options = {
    modules: availablePilets,
    getDependencies,
    strategy: isfunc(async) ? async : async ? blazingStrategy : standardStrategy,
    dependencies: globalDependencies,
    fetchModules() {
      const promise = requestPilets();

      if (process.env.DEBUG_PILET) {
        //createApi
        //context.injectPilet

        // const { setup } = require(process.env.DEBUG_PILET);
        // availablePilets.push({
        //   name: process.env.BUILD_PCKG_NAME || 'dbg',
        //   version: process.env.BUILD_PCKG_VERSION || '1.0.0',
        //   hash: '',
        //   setup,
        // });

        return promise.catch(() => []);
      }

      return promise;
    },
    createApi,
  };

  return {
    ...events,
    createApi,
    options,
    context,
    root: createApi({
      name: 'root',
      version: process.env.BUILD_PCKG_VERSION || '1.0.0',
      hash: '',
    }),
  };
}

export const Piral: React.FC<PortalProps> = ({ instance = createInstance(), breakpoints, children }) => {
  const [PiralRecallMediator] = React.useState(() => withRecall<MediatorProps, PiletApi>(Mediator, instance.options));

  return (
    <StateContext.Provider value={instance.context}>
      <ResponsiveLayout breakpoints={breakpoints} />
      <PiralRecallMediator />
      <PiralView>{children}</PiralView>
    </StateContext.Provider>
  );
};
Piral.displayName = 'Piral';
