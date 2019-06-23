import * as React from 'react';
import { ArbiterModule } from 'react-arbiter';
import { Dict, TileRegistration } from 'piral-core';
import { SampleApi } from '../types';

/**
 * Shows the possibility of extending default functionality (e.g., the dashboard)
 * with an extension defined by a module.
 */
export const DashboardPilet: ArbiterModule<SampleApi> = {
  content: '',
  dependencies: {},
  name: 'Dashboard Module',
  version: '1.0.0',
  hash: '3',
  setup(piral) {
    piral.registerExtension<{ tiles: Dict<TileRegistration> }>('dashboard', ({ params: { tiles } }) => (
      <div className="tiles">
        {Object.keys(tiles).map(tile => {
          const Component = tiles[tile].component;
          return <Component key={tile} columns={1} rows={1} />;
        })}
      </div>
    ));
  },
};
