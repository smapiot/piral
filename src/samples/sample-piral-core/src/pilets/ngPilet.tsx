import { Component, Inject } from '@angular/core';
import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';

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

  constructor(@Inject('Props') public props: TileComponentProps) {}

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
export const NgPilet: Pilet = {
  content: '',
  name: 'Angular Module',
  version: '1.0.0',
  hash: '430',
  setup(piral) {
    piral.registerTile(
      {
        component: TileComponent,
        type: 'ng',
      },
      {
        initialColumns: 2,
        initialRows: 2,
      },
    );
  },
};
