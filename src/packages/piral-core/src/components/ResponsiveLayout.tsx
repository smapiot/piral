import * as React from 'react';
import { useMedia, useGlobalState, useAction } from '../hooks';
import { defaultLayouts, defaultRender, defaultBreakpoints } from '../utils';
import { LayoutBreakpoints } from '../types';

export interface ResponsiveLayoutProps {
  breakpoints?: LayoutBreakpoints;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ breakpoints = defaultBreakpoints, children }) => {
  const current = useGlobalState(m => m.app.layout) || 'desktop';
  const changeTo = useAction('changeLayout');
  const selected = useMedia(breakpoints, defaultLayouts, current);

  React.useEffect(() => {
    if (selected !== current) {
      changeTo(selected);
    }
  }, [selected]);

  return defaultRender(children);
};
ResponsiveLayout.displayName = 'ResponsiveLayout';
