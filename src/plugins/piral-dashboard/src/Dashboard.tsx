import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useGlobalState } from 'piral-core';
import { PiralDashboardContainer, PiralDashboardTile } from './components';

export const Dashboard: React.FC<RouteComponentProps> = props => {
  const tiles = useGlobalState(s => s.registry.tiles);
  const children = Object.keys(tiles).map(tile => {
    const { component: Component, preferences } = tiles[tile];
    const { initialColumns = 1, initialRows = 1, resizable = false } = preferences;
    return (
      <PiralDashboardTile
        key={tile}
        columns={initialColumns}
        rows={initialRows}
        resizable={resizable}
        meta={preferences}>
        <Component columns={initialColumns} rows={initialRows} />
      </PiralDashboardTile>
    );
  });

  return <PiralDashboardContainer {...props} children={children} />;
};
Dashboard.displayName = 'Dashboard';
