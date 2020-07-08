import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const ScrollToTop: React.FC<RouteComponentProps> = ({ history, location }) => {
  React.useEffect(() => {
    if (history.action === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // tslint:disable-next-line:no-null-keyword
  return null;
};
