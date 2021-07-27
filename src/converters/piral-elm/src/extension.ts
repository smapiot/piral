export function createExtension(selector: string): any {
  if ('customElements' in window) {
    class ElmExtension extends HTMLElement {
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

    customElements.define(selector, ElmExtension);
  }
  
  return selector;
}
