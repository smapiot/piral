import * as React from 'react';
import { StaticRouter } from 'react-router';
import { createInstance } from './createInstance';
import { PiralView, RegisteredRouter } from './components';
import { useGlobalState } from './hooks';
import { PiralContext } from './PiralContext';
import type { PiralProps } from './types';

const FallbackRouter: React.FC = (props) => {
  const publicPath = useGlobalState((s) => s.app.publicPath);
  return <StaticRouter location="/" {...props} basename={publicPath} />;
};

const Router = typeof window === 'undefined' ? FallbackRouter : RegisteredRouter;

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
    <Router>
      <PiralView breakpoints={breakpoints}>{children}</PiralView>
    </Router>
  </PiralContext>
);
Piral.displayName = 'Piral';
