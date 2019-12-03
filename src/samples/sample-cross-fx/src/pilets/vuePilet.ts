import Tile from './Tile.vue';
import { Component } from 'vue';
import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';

/**
 * Shows an API extension using Vue components.
 */
export const VuePilet: Pilet = {
  content: '',
  name: 'Vue Module',
  version: '1.0.0',
  hash: '429',
  setup(piral) {
    piral.registerTile(piral.fromVue(Tile as Component<TileComponentProps>), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
