import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export const ScrollToTop: React.FC<RouteComponentProps> = ({ history }) => {
  if (history.action === 'PUSH') {
    window.scrollTo(0, 0);
  }

  return null;
};
