import * as React from 'react';
import { useMedia, useGlobalState, useGlobalStateContext } from '../hooks';
import { defaultLayouts, defaultRender, defaultBreakpoints } from '../utils';
import { LayoutBreakpoints } from '../types';

/**
 * The props for the ResponsiveLayout component.
 */
export interface ResponsiveLayoutProps {
  /**
   * The individual breakpoints to be used for the different layouts.
   */
  breakpoints?: LayoutBreakpoints;
}

/**
 * The component capable of identifying and switching the currently used layout.
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ breakpoints = defaultBreakpoints, children }) => {
  const current = useGlobalState((m) => m.app.layout) || 'desktop';
  const { changeLayout } = useGlobalStateContext();
  const selected = useMedia(breakpoints, defaultLayouts, current);

  React.useEffect(() => {
    if (selected !== current) {
      changeLayout(selected);
    }
  }, [selected]);

  return defaultRender(children);
};
ResponsiveLayout.displayName = 'ResponsiveLayout';
