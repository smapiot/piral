import * as React from 'react';
import { Router } from 'react-router-dom';
import { RecallProps } from 'react-arbiter';
import { Routes } from './routes';
import { Responsive } from './responsive';
import { defaultBreakpoints } from '../utils';
import { useGlobalState } from '../hooks';
import { PortalProps } from '../types';

export const Portal: React.FC<PortalProps & RecallProps> = ({
  breakpoints = defaultBreakpoints,
  children,
  loaded,
  error,
}) => {
  const { ErrorInfo, Loader, history } = useGlobalState(s => s.app.components);

  return (
    <Router history={history}>
      <Responsive breakpoints={breakpoints}>
        {loaded ? (
          error ? (
            <ErrorInfo type="loading" error={error} />
          ) : (
            children(<Routes NotFound={props => <ErrorInfo type="not_found" {...props} />} />)
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
