import * as React from 'react';
import { createInstance } from './createInstance';
import { PiralView, ResponsiveLayout } from './components';
import { PiralContext } from './PiralContext';
import type { PiralProps } from './types';

/**
 * Represents the Piral app shell frame. Use this component together
 * with an existing instance to render the app shell.
 * Includes layout and routing handling. Connects the piral context
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
  <PiralContext instance={instance}>
    <ResponsiveLayout breakpoints={breakpoints} />
    <PiralView>
      {children}
    </PiralView>
  </PiralContext>
);
Piral.displayName = 'Piral';
