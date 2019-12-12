import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';
import { inlineView } from 'aurelia-framework';

@inlineView(`
<template>
  <div class="tile">
    <h3>Aurelia: \${counter}</h3>
    <p>
      \${props.rows} rows and \${props.columns} columns
    </p>
    <button click.trigger="increment()">Increment</button>
    <button click.trigger="decrement()">Decrement</button>
  </div>
<template>`)
class Tile {
  private counter = 0;

  constructor(public props: TileComponentProps = { rows: 0, columns: 0, piral: undefined }) {}

  increment() {
    this.counter = this.counter + 1;
  }

  decrement() {
    this.counter = this.counter - 1;
  }
}

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
