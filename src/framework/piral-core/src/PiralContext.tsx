import * as React from 'react';
import { StateContext } from './state';
import { createInstance } from './createInstance';
import { Mediator } from './components';
import { useGlobalState } from './hooks';
import { RootListener } from './RootListener';
import type { PiralContextProps } from './types';

interface PiralProviderProps {
  children: React.ReactNode;
}

const PiralProvider: React.FC<PiralProviderProps> = ({ children }) => {
  const Provider = useGlobalState((m) => m.provider || React.Fragment);
  return <Provider>{children}</Provider>;
};

/**
 * Represents the Piral app shell frame. Use this component together
 * with an existing instance to render components from micro frontends
 * in your app.
 * Wires the state container together with the global providers.
 *
 * @example
```jsx
const app = (
  <MyRouter>
    <PiralContext instance={yourPiralInstance}>
      <PiralGlobals />
      <MyAppContent />
    </PiralContext>
  </MyRouter>
);
```
 */
export const PiralContext: React.FC<PiralContextProps> = ({ instance = createInstance(), children }) => (
  <StateContext.Provider value={instance.context}>
    <Mediator options={instance.options} key={instance.id} />
    <RootListener />
    <PiralProvider>{children}</PiralProvider>
  </StateContext.Provider>
);
PiralContext.displayName = 'PiralContext';
