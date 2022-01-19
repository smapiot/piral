import * as React from 'react';
import { StateContext } from './state';
import { createInstance } from './createInstance';
import { PiralView, Mediator, ResponsiveLayout, PortalRenderer } from './components';
import { RootListener } from './RootListener';
import type { PiralProps } from './types';

/**
 * Represents the Piral app shell frame. Use this component together
 * with an existing instance to render the app shell.
 * Includes layout and routing handling. Wires the state container
 * to the generated views.
 *
 * @example
```jsx
const app = (
  <Piral instance={yourPiralInstance}>
    <Define name="Layout" component={MyLayout} />
  </Piral>
);
```
 */
export const Piral: React.FC<PiralProps> = ({ instance = createInstance(), breakpoints, children }) => (
  <StateContext.Provider value={instance.context}>
    <ResponsiveLayout breakpoints={breakpoints} />
    <Mediator options={instance.options} key={instance.id} />
    <RootListener />
    <PiralView>
      <PortalRenderer id="root" />
      {children}
    </PiralView>
  </StateContext.Provider>
);
Piral.displayName = 'Piral';
