import * as React from 'react';
import { getExtensionSlot } from '../extension';
import { useGlobalState } from '../../hooks';
import { DashboardProps } from '../../types';

const ExtensionSlot = getExtensionSlot('dashboard');

export const DefaultDashboard: React.SFC<DashboardProps> = props => {
  const tiles = useGlobalState(s => s.components.tiles);

  return (
    <ExtensionSlot
      params={{ tiles, ...props }}
      empty={() => (
        <React.Fragment key="default_dashboard">
          {Object.keys(tiles).map(tile => {
            const Component = tiles[tile].component;
            return <Component key={tile} columns={1} rows={1} />;
          })}
        </React.Fragment>
      )}
    />
  );
};
DefaultDashboard.displayName = 'DefaultDashboard';

export default DefaultDashboard;
