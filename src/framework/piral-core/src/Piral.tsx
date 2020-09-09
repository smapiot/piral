import * as React from 'react';
import { StateContext } from './state';
import { createInstance } from './createInstance';
import { PiralView, Mediator, ResponsiveLayout } from './components';
import type { PortalProps } from './types';

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
export const Piral: React.FC<PortalProps> = ({ instance = createInstance(), breakpoints, children }) => (
  <StateContext.Provider value={instance.context}>
    <ResponsiveLayout breakpoints={breakpoints} />
    <Mediator options={instance.options} />
    <PiralView>{children}</PiralView>
  </StateContext.Provider>
);
Piral.displayName = 'Piral';
