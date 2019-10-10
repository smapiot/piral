import * as React from 'react';
import { useGlobalState, ExtensionSlot } from 'piral-core';
import { DashboardProps } from './types';

export const DefaultDashboard: React.FC<DashboardProps> = props => {
  const tiles = useGlobalState(s => s.components.tiles);

  return (
    <ExtensionSlot
      name="dashboard"
      params={{ tiles, ...props }}
      empty={() => (
        <React.Fragment key="default_dashboard">
          {Object.keys(tiles).map(tile => {
            const {
              component: Component,
              preferences: { initialColumns = 1, initialRows = 1 },
            } = tiles[tile];
            return <Component key={tile} columns={initialColumns} rows={initialRows} />;
          })}
        </React.Fragment>
      )}
    />
  );
};
DefaultDashboard.displayName = 'DefaultDashboard';

export default DefaultDashboard;
