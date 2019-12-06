import { LitElement, customElement, html, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Pilet } from 'piral-core';
import { TileComponentProps } from 'piral-dashboard';

/**
 * Shows an API extension using LitElement components.
 */
export const LitElPilet: Pilet = {
  content: '',
  name: 'LitElement Module',
  version: '1.0.0',
  hash: '511',
  setup(piral) {
    const extension = `<${piral.LitElExtension} name="smiley"></${piral.LitElExtension}>`;

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
              ${this.props.rows} rows and ${this.props.columns} columns ${unsafeHTML(extension)}
            </p>
            <button @click="${() => this.counter++}">Increment</button>
            <button @click="${() => this.counter--}">Decrement</button>
          </div>
        `;
      }
    }

    piral.registerTile(piral.fromLitEl('my-tile'), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
