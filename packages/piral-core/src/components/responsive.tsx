import * as React from 'react';
import { useMedia, useGlobalState, useAction } from '../hooks';
import { defaultLayouts } from '../utils';

export interface ResponsiveProps {}

export const Responsive: React.SFC<ResponsiveProps> = ({ children }) => {
  const { breakpoints, current } = useGlobalState(m => m.app.layout);
  const changeTo = useAction('changeLayout');
  const selected = useMedia(breakpoints, defaultLayouts, current);

  if (selected !== current) {
    changeTo(selected);
  }

  return <>{children}</>;
};
Responsive.displayName = 'Responsive';

export default Responsive;
