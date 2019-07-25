import { Component, Inject } from '@angular/core';
import { ArbiterModule } from 'react-arbiter';
import { TileComponentProps } from 'piral-core';
import { SampleApi } from '../types';

@Component({
  template: `
    <div class="tile">
      <h3>Angular: {{ counter }}</h3>
      <p>{{ props.rows }} rows and {{ props.columns }} columns</p>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
    </div>
  `,
})
export class TileComponent {
  public counter = 0;

  constructor(@Inject('TileProps') public props: TileComponentProps<any>) {}

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }
}

/**
 * Shows an API extension using Angular components.
 */
export const NgPilet: ArbiterModule<SampleApi> = {
  content: '',
  name: 'Angular Module',
  version: '1.0.0',
  hash: '430',
  setup(piral) {
    piral.registerTileNg('my-ng-tile', TileComponent, {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
