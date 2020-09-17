import * as React from 'react';
import { ExtensionSlot, defaultRender } from 'piral-core';
import { DashboardContainerProps, DashboardTileProps } from './types';

export const DefaultContainer: React.FC<DashboardContainerProps> = (props) => (
  <ExtensionSlot name="dashboard" params={props} empty={() => defaultRender(props.children, 'default_dashboard')} />
);

export const DefaultTile: React.FC<DashboardTileProps> = (props) => defaultRender(props.children);
