import * as React from 'react';
import { ExtensionSlot, defaultRender } from 'piral-core';
import { DashboardProps, TileProps } from './types';

export const DefaultDashboard: React.FC<DashboardProps> = props => (
  <ExtensionSlot
    name="dashboard"
    params={props}
    empty={() => <React.Fragment key="default_dashboard">{props.children}</React.Fragment>}
  />
);

export const DefaultTile: React.FC<TileProps> = props => defaultRender(props.children);
