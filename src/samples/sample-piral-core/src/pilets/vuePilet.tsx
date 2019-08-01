import Tile from './Tile.vue';
import { ArbiterModule } from 'react-arbiter';
import { SampleApi } from '../types';

/**
 * Shows an API extension using Vue components.
 */
export const VuePilet: ArbiterModule<SampleApi> = {
  content: '',
  name: 'Vue Module',
  version: '1.0.0',
  hash: '429',
  setup(piral) {
    piral.registerTileVue(Tile, {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
