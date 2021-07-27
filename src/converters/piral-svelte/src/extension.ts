export function createExtension(selector: string) {
  if ('customElements' in window) {
    class SvelteExtension extends HTMLElement {
      connectedCallback() {
        if (this.isConnected) {
          this.dispatchEvent(
            new CustomEvent('render-html', {
              bubbles: true,
              detail: {
                target: this,
                props: {
                  name: this.getAttribute('name'),
                },
              },
            }),
          );
        }
      }
    }

    customElements.define(selector, SvelteExtension);
  }

  return selector;
}
