import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PiralRoutes } from './PiralRoutes';
import { useGlobalState } from '../hooks';
import { PiralError, PiralRouter, PiralLoadingIndicator, PiralLayout } from './helpers';

const NotFound: React.FC<RouteComponentProps> = props => <PiralError type="not_found" {...props} />;

const PiralContent: React.FC = () => {
  const { error, loading, layout } = useGlobalState(m => m.app);

  return error ? (
    <PiralError type="loading" error={error} />
  ) : loading ? (
    <PiralLoadingIndicator />
  ) : (
    <PiralLayout currentLayout={layout}>
      <PiralRoutes NotFound={NotFound} />
    </PiralLayout>
  );
};

const PiralProvider: React.FC = ({ children }) => {
  const provider = useGlobalState(m => m.provider) || <React.Fragment />;
  return React.cloneElement(provider, undefined, children);
};

export interface PiralViewProps {}

export const PiralView: React.FC<PiralViewProps> = ({ children }) => (
  <PiralProvider>
    <PiralRouter>
      <PiralContent />
      {children}
    </PiralRouter>
  </PiralProvider>
);
PiralView.displayName = 'PiralView';
