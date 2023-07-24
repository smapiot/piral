import * as React from 'react';
import { createInstance } from './createInstance';
import { PiralView, RegisteredRouter } from './components';
import { PiralContext } from './PiralContext';
import type { PiralProps } from './types';

/**
 * Represents the Piral app shell frame. Use this component together
 * with an existing instance to render the app shell.
 * Includes layout and routing handling. Connects the Piral context
 * and the React router to the generated views.
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
    <RegisteredRouter publicPath={instance.context.navigation.publicPath}>
      <PiralView breakpoints={breakpoints}>{children}</PiralView>
    </RegisteredRouter>
  </PiralContext>
);
Piral.displayName = 'Piral';
