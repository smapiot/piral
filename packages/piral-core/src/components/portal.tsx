import * as React from 'react';
import { RecallProps } from 'react-arbiter';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes';
import { Responsive } from './responsive';
import { useGlobalState } from '../hooks';

export interface PortalProps {
  children(content: React.ReactNode): React.ReactElement<any>;
}

export const Portal: React.SFC<PortalProps & RecallProps> = ({ children, loaded, error }) => {
  const { Dashboard, ErrorInfo, Loader } = useGlobalState(s => s.app.components);

  return (
    <BrowserRouter>
      <Responsive>
        {loaded ? (
          children(
            error ? (
              <ErrorInfo type="loading" error={error} />
            ) : (
              <Routes Home={Dashboard} NotFound={props => <ErrorInfo type="not_found" {...props} />} />
            ),
          )
        ) : (
          <Loader />
        )}
      </Responsive>
    </BrowserRouter>
  );
};
Portal.displayName = 'Portal';

export default Portal;
