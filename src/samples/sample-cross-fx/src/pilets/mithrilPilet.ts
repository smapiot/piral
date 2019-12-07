import { m } from 'mithril';
import { Pilet } from 'piral-core';

const Tile = {
  oninit() {
    this.count = 0;
  },
  view(vnode) {
    const { rows, columns, piral } = vnode.attrs;
    const { MithrilExtension } = piral;

    return m(
      'div',
      {
        class: 'tile',
      },
      m('h3', {}, `Mithril: ${this.count}`),
      m(
        'p',
        {},
        `${rows} rows and ${columns} columns `,
        m(MithrilExtension, {
          name: 'smiley',
        }),
      ),
      m(
        'button',
        {
          onclick: () => this.count++,
        },
        '+',
      ),
      m(
        'button',
        {
          onclick: () => this.count--,
        },
        '-',
      ),
    );
  },
};

/**
 * Shows an API extension using Mithril.js components.
 */
export const MithrilPilet: Pilet = {
  content: '',
  name: 'Mithril Module',
  version: '1.0.0',
  hash: '589',
  setup(piral) {
    piral.registerTile(piral.fromMithril(Tile), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
