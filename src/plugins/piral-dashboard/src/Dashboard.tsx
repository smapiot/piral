import * as React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { useGlobalState } from 'piral-core';
import { PiralDashboardContainer, PiralDashboardTile } from './components';
import { TileRegistration } from './types';

export interface DashboardProps extends RouteComponentProps {
  filter?(tile: TileRegistration): boolean;
}

/**
 * The dashboard component. Integrate this as a page or in a component
 * where dashboard information (tiles) should be shown.
 */
export const Dashboard: React.FC<DashboardProps> = (props) => {
  const tiles = useGlobalState((s) => s.registry.tiles);
  const { filter = () => true } = props;
  const children = Object.keys(tiles)
    .filter((tile) => filter(tiles[tile]))
    .map((tile) => {
      const { component: Component, preferences } = tiles[tile];
      const { initialColumns = 1, initialRows = 1, resizable = false } = preferences;
      return (
        <PiralDashboardTile
          key={tile}
          columns={initialColumns}
          rows={initialRows}
          resizable={resizable}
          meta={preferences}
        >
          <Component columns={initialColumns} rows={initialRows} />
        </PiralDashboardTile>
      );
    });

  return <PiralDashboardContainer {...props} children={children} />;
};
Dashboard.displayName = 'Dashboard';
