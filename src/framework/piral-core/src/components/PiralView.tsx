import * as React from 'react';
import { RouteComponentProps, StaticRouter } from 'react-router';
import { PiralGlobals } from './PiralGlobals';
import { PiralRoutes } from './PiralRoutes';
import { PiralSuspense } from './PiralSuspense';
import { RegisteredErrorInfo, RegisteredRouter, RegisteredRouteSwitch, RegisteredLayout } from './components';
import { useGlobalState } from '../hooks';

const NotFound: React.FC<RouteComponentProps> = (props) => <RegisteredErrorInfo type="not_found" {...props} />;

const PiralContent: React.FC = () => {
  const { layout } = useGlobalState((m) => m.app);

  return (
    <PiralSuspense>
      <RegisteredLayout currentLayout={layout}>
        <PiralRoutes NotFound={NotFound} RouteSwitch={RegisteredRouteSwitch} />
      </RegisteredLayout>
    </PiralSuspense>
  );
};

const FallbackRouter: React.FC = (props) => {
  const publicPath = useGlobalState((s) => s.app.publicPath);
  return <StaticRouter location="/" {...props} basename={publicPath} />;
};

const Router = typeof window === 'undefined' ? FallbackRouter : RegisteredRouter;

/**
 * The props for the PiralView component.
 */
export interface PiralViewProps {}

/**
 * The component responsible for the generic view of the application.
 * This includes the used Router, the current content and some convenience.
 */
export const PiralView: React.FC<PiralViewProps> = ({ children }) => (
  <Router>
    <PiralGlobals />
    <PiralContent />
    {children}
  </Router>
);
PiralView.displayName = 'PiralView';
