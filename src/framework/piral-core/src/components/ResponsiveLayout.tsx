import * as React from 'react';
import { useMedia } from '../hooks';
import { defaultLayouts, defaultBreakpoints } from '../utils';
import { LayoutBreakpoints, LayoutProps } from '../types';

/**
 * The props for the ResponsiveLayout component.
 */
export interface ResponsiveLayoutProps {
  /**
   * The individual breakpoints to be used for the different layouts.
   */
  breakpoints?: LayoutBreakpoints;
  /**
   * The actual layout component to render to transport.
   */
  Layout: React.ComponentType<LayoutProps>;
  /**
   * The content to display.
   */
  children: React.ReactNode;
}

/**
 * The component capable of identifying and switching the currently used layout.
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  breakpoints = defaultBreakpoints,
  Layout,
  children,
}) => {
  const selected = useMedia(breakpoints, defaultLayouts, 'desktop');
  return <Layout currentLayout={selected}>{children}</Layout>;
};
ResponsiveLayout.displayName = 'ResponsiveLayout';
