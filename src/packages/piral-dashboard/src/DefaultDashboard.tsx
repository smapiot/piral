import * as React from 'react';
import { ExtensionSlot } from 'piral-core';
import { DashboardProps } from './types';

export const DefaultDashboard: React.FC<DashboardProps> = props => (
  <ExtensionSlot
    name="dashboard"
    params={props}
    empty={() => <React.Fragment key="default_dashboard">{props.children}</React.Fragment>}
  />
);
DefaultDashboard.displayName = 'DefaultDashboard';
