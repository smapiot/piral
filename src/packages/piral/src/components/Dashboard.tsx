import * as React from 'react';
import { DashboardProps, getExtensionSlot, useGlobalState } from 'piral-core';

const ExtensionSlot = getExtensionSlot('dashboard');

export const Dashboard: React.SFC<DashboardProps> = props => {
  const tiles = useGlobalState(s => s.components.tiles);

  return (
    <>
      <pi-dashboard>
        {Object.keys(tiles).map(tile => {
          const {
            component: Component,
            preferences: { initialColumns = 1, initialRows = 1, resizable = false },
          } = tiles[tile];
          return (
            <pi-tile key={tile} data-cols={initialColumns} data-rows={initialRows} data-resizable={resizable}>
              <Component columns={initialColumns} rows={initialRows} />
            </pi-tile>
          );
        })}
      </pi-dashboard>
      <ExtensionSlot params={{ tiles, ...props }} />
    </>
  );
};
