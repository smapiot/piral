import * as React from 'react';
import { DashboardProps, getExtensionSlot, useGlobalState } from 'piral-core';
import { DashboardContainerProps, TileProps } from '../types';

const ExtensionSlot = getExtensionSlot('dashboard');

export interface DashboardCreator {
  DashboardContainer: React.ComponentType<DashboardContainerProps>;
  Tile: React.ComponentType<TileProps>;
}

export function createDashboard({ DashboardContainer, Tile }: DashboardCreator): React.SFC<DashboardProps> {
  return props => {
    const tiles = useGlobalState(s => s.components.tiles);

    return (
      <>
        <DashboardContainer>
          {Object.keys(tiles).map(tile => {
            const {
              component: Component,
              preferences: { initialColumns = 1, initialRows = 1, resizable = false },
            } = tiles[tile];
            return (
              <Tile key={tile} columns={initialColumns} rows={initialRows} resizable={resizable}>
                <Component columns={initialColumns} rows={initialRows} />
              </Tile>
            );
          })}
        </DashboardContainer>
        <ExtensionSlot params={{ tiles, ...props }} />
      </>
    );
  };
}
