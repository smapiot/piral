import * as React from 'react';
import { navigate, useDebugState } from './state';

export interface DebugTrackerProps {}

export const DebugTracker: React.FC<DebugTrackerProps> = () => {
  const route = useDebugState((s) => s.route);

  React.useEffect(() => {
    if (route) {
      navigate(route.path, route.state);
    }
  }, [route]);

  // tslint:disable-next-line:no-null-keyword
  return null;
};
