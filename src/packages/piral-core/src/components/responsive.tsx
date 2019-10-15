import * as React from 'react';
import { useMedia, useGlobalState, useAction } from '../hooks';
import { defaultLayouts, defaultRender, defaultBreakpoints } from '../utils';
import { LayoutBreakpoints } from '../types';

export interface ResponsiveProps {
  breakpoints?: LayoutBreakpoints;
}

export const Responsive: React.FC<ResponsiveProps> = ({ breakpoints = defaultBreakpoints, children }) => {
  const current = useGlobalState(m => m.app.layout) || 'desktop';
  const changeTo = useAction('changeLayout');
  const selected = useMedia(breakpoints, defaultLayouts, current);

  if (selected !== current) {
    changeTo(selected);
  }

  return defaultRender(children);
};
Responsive.displayName = 'Responsive';
