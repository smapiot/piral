import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useGlobalState, getCommonComponent } from 'piral-core';
import { DashboardProps } from './types';

const DashboardView: React.ComponentType<DashboardProps> = getCommonComponent('Dashboard');

export const Dashboard: React.FC<RouteComponentProps> = props => {
  const tiles = useGlobalState(s => s.registry.tiles);
  const children = Object.keys(tiles).map(tile => {
    const {
      component: Component,
      preferences: { initialColumns = 1, initialRows = 1 },
    } = tiles[tile];
    return <Component key={tile} columns={initialColumns} rows={initialRows} />;
  });

  return <DashboardView {...props} children={children} />;
};
Dashboard.displayName = 'Dashboard';
