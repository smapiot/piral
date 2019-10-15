import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Routes } from './Routes';
import { useGlobalState } from '../hooks';
import { ComponentError, ComponentRouter, ComponentLoader, ComponentLayout } from './helpers';

const NotFound: React.FC<RouteComponentProps> = props => <ComponentError type="not_found" {...props} />;

const PortalContent: React.FC = () => {
  const { error, loading } = useGlobalState(m => m.app);

  return error ? (
    <ComponentError type="loading" error={error} />
  ) : loading ? (
    <ComponentLoader />
  ) : (
    <ComponentLayout>
      <Routes NotFound={NotFound} />
    </ComponentLayout>
  );
};

export interface PortalViewProps {}

export const PortalView: React.FC<PortalViewProps> = ({ children }) => (
  <ComponentRouter>
    <PortalContent />
    {children}
  </ComponentRouter>
);
PortalView.displayName = 'PortalView';
