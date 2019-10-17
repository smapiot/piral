import * as React from 'react';
import { ExtensionSlot, defaultRender } from 'piral-core';
import { DashboardContainerProps, DashboardTileProps } from './types';

export const DefaultContainer: React.FC<DashboardContainerProps> = props => (
  <ExtensionSlot
    name="dashboard"
    params={props}
    empty={() => <React.Fragment key="default_dashboard">{props.children}</React.Fragment>}
  />
);

export const DefaultTile: React.FC<DashboardTileProps> = props => defaultRender(props.children);
