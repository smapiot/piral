import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from 'piral-core';

export const DebugTracker: React.FC = () => {
  const route = useGlobalState((s) => s.$debug.route);
  const history = useHistory();

  React.useEffect(() => {
    if (route) {
      history.push(route);
    }
  }, [route]);

  // tslint:disable-next-line:no-null-keyword
  return null;
};
