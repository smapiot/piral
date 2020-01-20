import * as React from 'react';
import { withRecall, blazingStrategy, standardStrategy, isfunc } from 'react-arbiter';
import { getLocalDependencies, defaultApiCreator, defaultModuleRequester } from './modules';
import { createGlobalState, createActions, StateContext, includeActions } from './state';
import { PiralView, Mediator, MediatorProps, ResponsiveLayout } from './components';
import { createArbiterOptions } from './helpers';
import { createListener } from './utils';
import { PiletApi, PiralConfiguration, PortalProps, PiralInstance } from './types';

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
  const options = createArbiterOptions({
    context,
    createApi,
    availablePilets,
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
