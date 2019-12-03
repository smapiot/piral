import { Pilet } from 'piral-core';
import { Component, ComponentType } from 'inferno';
import { createElement } from 'inferno-create-element';
import { TileComponentProps } from 'piral-dashboard';

const Tile = (class extends Component<TileComponentProps> {
  state = {
    count: 0,
  };

  private increment = () => this.setState({ count: this.state.count + 1 });

  private decrement = () => this.setState({ count: this.state.count - 1 });

  render() {
    const { piral, rows, columns } = this.props;
    const { count } = this.state;
    const { InfernoExtension } = piral;

    return createElement(
      'div',
      {
        class: 'tile',
      },
      createElement('h3', {}, `Inferno: ${count}`),
      createElement(
        'p',
        {},
        `${rows} rows and ${columns} columns `,
        createElement(InfernoExtension as any, {
          name: 'smiley',
        }),
      ),
      createElement(
        'button',
        {
          onClick: this.increment,
        },
        '+',
      ),
      createElement(
        'button',
        {
          onClick: this.decrement,
        },
        '-',
      ),
    );
  }
} as any) as ComponentType<TileComponentProps>;

/**
 * Shows an API extension using Inferno components.
 */
export const InfernoPilet: Pilet = {
  content: '',
  name: 'Inferno Module',
  version: '1.0.0',
  hash: '731',
  setup(piral) {
    piral.registerTile(piral.fromInferno(Tile), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
