import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { PiralGlobals } from './PiralGlobals';
import { PiralRoutes } from './PiralRoutes';
import { PiralSuspense } from './PiralSuspense';
import { ResponsiveLayout } from './ResponsiveLayout';
import { RegisteredErrorInfo, RegisteredRouteSwitch, RegisteredLayout } from './components';
import { LayoutBreakpoints } from '../types';

const NotFound: React.FC<RouteComponentProps> = (props) => <RegisteredErrorInfo type="not_found" {...props} />;

/**
 * The props for the PiralView component.
 */
export interface PiralViewProps {
  /**
   * The custom breakpoints for the different layout modi.
   */
  breakpoints?: LayoutBreakpoints;
  /**
   * The extra content.
   */
  children: React.ReactNode;
}

/**
 * The component responsible for the generic view of the application.
 * This includes the used the current content and some convenience.
 */
export const PiralView: React.FC<PiralViewProps> = ({ breakpoints, children }) => (
  <>
    <PiralGlobals />
    <PiralSuspense>
      <ResponsiveLayout breakpoints={breakpoints} Layout={RegisteredLayout}>
        <PiralRoutes NotFound={NotFound} RouteSwitch={RegisteredRouteSwitch} />
      </ResponsiveLayout>
    </PiralSuspense>
    {children}
  </>
);
PiralView.displayName = 'PiralView';
