import Tile from './Tile.vue';
import { Pilet } from 'piral-core';

/**
 * Shows an API extension using Vue components.
 */
export const VuePilet: Pilet = {
  content: '',
  name: 'Vue Module',
  version: '1.0.0',
  hash: '429',
  setup(piral) {
    piral.registerTile(
      {
        root: Tile,
        type: 'vue',
      },
      {
        initialColumns: 2,
        initialRows: 2,
      },
    );
  },
};
