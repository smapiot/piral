import * as React from 'react';
import { RouteComponentProps, StaticRouter } from 'react-router';
import { PiralRoutes } from './PiralRoutes';
import {
  PiralError,
  PiralRouter,
  PiralLoadingIndicator,
  PiralRouteSwitch,
  PiralLayout,
  PiralDebug,
} from './components';
import { useGlobalState } from '../hooks';

const NotFound: React.FC<RouteComponentProps> = (props) => <PiralError type="not_found" {...props} />;

const PiralContent: React.FC = () => {
  const { error, loading, layout } = useGlobalState((m) => m.app);

  return error ? (
    <PiralError type="loading" error={error} />
  ) : loading ? (
    <PiralLoadingIndicator />
  ) : (
    <PiralLayout currentLayout={layout}>
      <PiralRoutes NotFound={NotFound} RouteSwitch={PiralRouteSwitch} />
    </PiralLayout>
  );
};

const FallbackRouter: React.FC = (props) => {
  const publicPath = useGlobalState((s) => s.app.publicPath);
  return <StaticRouter location="/" {...props} basename={publicPath} />;
};

const Router = typeof window === 'undefined' ? FallbackRouter : PiralRouter;

const PiralProvider: React.FC = ({ children }) => {
  const provider = useGlobalState((m) => m.provider) || React.Fragment;
  return React.createElement(provider, undefined, children);
};

/**
 * The props for the PiralView component.
 */
export interface PiralViewProps {}

/**
 * The component responsible for the generic view of the application.
 * This includes the global providers, the used Router, the current content and some convenience.
 */
export const PiralView: React.FC<PiralViewProps> = ({ children }) => (
  <PiralProvider>
    <Router>
      <PiralContent />
      {children}
      <PiralDebug />
    </Router>
  </PiralProvider>
);
PiralView.displayName = 'PiralView';
