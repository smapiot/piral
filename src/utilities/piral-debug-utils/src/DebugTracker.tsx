import * as React from 'react';
import { useHistory } from 'react-router';
import { useDebugState } from './state';

export interface DebugTrackerProps {}

export const DebugTracker: React.FC<DebugTrackerProps> = () => {
  const route = useDebugState((s) => s.route);
  const history = useHistory();

  React.useEffect(() => {
    if (route) {
      history.push(route.path, route.state);
    }
  }, [route]);

  // tslint:disable-next-line:no-null-keyword
  return null;
};
