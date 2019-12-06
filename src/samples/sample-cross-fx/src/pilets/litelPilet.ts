import { LitElement, customElement, html, property } from 'lit-element';
import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';

@customElement('my-tile')
class MyTile extends LitElement {
  @property() counter = 0;
  @property({ type: Object }) props: TileComponentProps;

  firstUpdated() {
    const style = this.shadowRoot.ownerDocument.createElement('style');
    style.appendChild(
      document.createTextNode(
        Array.prototype.map
          .call(
            document.querySelectorAll('link[rel=stylesheet]'),
            sheet => `@import url(${JSON.stringify(sheet.href)});`,
          )
          .join('\n'),
      ),
    );
    this.shadowRoot.prepend(style);
  }

  render() {
    return html`
      <div class="tile">
        <h3>LitElement: ${this.counter}</h3>
        <p>
          ${this.props.rows} rows and ${this.props.columns} columns
          <litel-extension name="smiley"></litel-extension>
        </p>
        <button @click="${() => this.counter++}">Increment</button>
        <button @click="${() => this.counter--}">Decrement</button>
      </div>
    `;
  }
}

/**
 * Shows an API extension using LitElement components.
 */
export const LitElPilet: Pilet = {
  content: '',
  name: 'LitElement Module',
  version: '1.0.0',
  hash: '511',
  setup(piral) {
    piral.registerTile(piral.fromLitEl('my-tile'), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
