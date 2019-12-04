import { LitElement, customElement, html, property } from 'lit-element';
import { Pilet } from 'piral-core';

@customElement('my-tile')
class MyTile extends LitElement {
  @property() counter = 0;
  @property() props: any;

  firstUpdated() {
    Array.prototype.forEach.call(document.querySelectorAll('link[rel=stylesheet]'), sheet => {
      const link = document.createElement('link');
      link.href = sheet.href;
      link.rel = sheet.rel;
      link.type = 'text/css';
      this.shadowRoot.prepend(link);
    });
  }

  render() {
    return html`
      <div class="tile">
        <h3>LitElement: ${this.counter}</h3>
        <p>
          ${this.props.rows} rows and ${this.props.columns} columns
          <extension-component name="smiley"></extension-component>
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
