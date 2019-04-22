declare module JSX {
  interface IntrinsicElements {
    'pi-tile': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-spinner': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-center': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-dashboard': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-error': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-title': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-description': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'pi-content': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

customElements.define(
  'pi-tile',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-tile');
    }
  },
);

customElements.define(
  'pi-spinner',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-spinner');
    }
  },
);

customElements.define(
  'pi-center',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-center');
    }
  },
);

customElements.define(
  'pi-dashboard',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-dashboard');
    }
  },
);

customElements.define(
  'pi-error',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-error');
    }
  },
);

customElements.define(
  'pi-title',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-title');
    }
  },
);

customElements.define(
  'pi-description',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-description');
    }
  },
);

customElements.define(
  'pi-container',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-container');
    }
  },
);

customElements.define(
  'pi-header',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-header');
    }
  },
);

customElements.define(
  'pi-content',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-content');
    }
  },
);

customElements.define(
  'pi-footer',
  class extends HTMLElement {
    connectedCallback() {
      this.classList.add('pi-footer');
    }
  },
);
