declare module JSX {
  interface IntrinsicElements {
    'pi-tile': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

customElements.define(
  'pi-tile',
  class extends HTMLElement {
    constructor() {
      super();
      this.classList.add('tile');
    }
  },
);
