import * as React from 'react';
import { useMedia, useGlobalState, useAction } from '../hooks';
import { defaultLayouts } from '../utils';
import { LayoutBreakpoints } from '../types';

export interface ResponsiveProps {
  breakpoints: LayoutBreakpoints;
}

export const Responsive: React.FC<ResponsiveProps> = ({ breakpoints, children }) => {
  const current = useGlobalState(m => m.app.layout) || 'desktop';
  const changeTo = useAction('changeLayout');
  const selected = useMedia(breakpoints, defaultLayouts, current);

  if (selected !== current) {
    changeTo(selected);
  }

  return <>{children}</>;
};
Responsive.displayName = 'Responsive';

export default Responsive;
