import { Pilet } from 'piral-core';

/**
 * Shows an API extension using Aurelia components.
 */
export const AureliaPilet: Pilet = {
  content: '',
  name: 'Aurelia Module',
  version: '1.0.0',
  hash: '409',
  setup(piral) {
    const Tile: any = undefined;
    piral.registerTile(piral.fromAurelia(Tile), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
