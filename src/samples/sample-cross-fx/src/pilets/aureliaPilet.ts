import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';
import { } from 'aurelia-framework';

/**
 * Shows an API extension using Aurelia components.
 */
export const AureliaPilet: Pilet = {
  content: '',
  name: 'Aurelia Module',
  version: '1.0.0',
  hash: '409',
  setup(piral) {
    piral.registerTile(piral.fromAurelia(Tile), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
