import { LitElement, property, customElement } from 'lit-element';

export function createExtension(selector = 'litel-extension'): any {
  @customElement(selector)
  class LitElExtension extends LitElement {
    @property() name: string;
    @property() params: any;
    @property() onEmpty: () => any;
    @property() onRender: () => any;

    render() {
      return undefined;
    }

    updated() {
      this.dispatchEvent(
        new CustomEvent('render-html', {
          bubbles: true,
          detail: {
            target: this.shadowRoot,
            props: {
              empty: this.onEmpty,
              render: this.onRender,
              params: this.params,
              name: this.name,
            },
          },
        }),
      );
    }
  }

  return LitElExtension;
}
