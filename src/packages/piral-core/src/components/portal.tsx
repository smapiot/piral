import * as React from 'react';
import { Router } from 'react-router-dom';
import { RecallProps } from 'react-arbiter';
import { Routes } from './routes';
import { Responsive } from './responsive';
import { useGlobalState } from '../hooks';
import { PortalProps } from '../types';

export const Portal: React.FC<PortalProps & RecallProps> = ({ children, loaded, error }) => {
  const { Dashboard, ErrorInfo, Loader, history } = useGlobalState(s => s.app.components);

  return (
    <Router history={history}>
      <Responsive>
        {loaded ? (
          error ? (
            <ErrorInfo type="loading" error={error} />
          ) : (
            children(<Routes Home={Dashboard} NotFound={props => <ErrorInfo type="not_found" {...props} />} />)
          )
        ) : (
          <Loader />
        )}
      </Responsive>
    </Router>
  );
};
Portal.displayName = 'Portal';

export default Portal;
