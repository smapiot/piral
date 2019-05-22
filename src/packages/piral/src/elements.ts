declare module JSX {
  type CustomHTMLElement = React.HTMLAttributes<HTMLElement> & {
    class?: string;
  };

  interface IntrinsicElements {
    'pi-tile': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-spinner': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-center': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-dashboard': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-error': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-title': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-description': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-details': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-notifications': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-close': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-menu': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-item': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
    'pi-search': React.DetailedHTMLProps<CustomHTMLElement, HTMLElement>;
  }
}

[
  'pi-tile',
  'pi-spinner',
  'pi-center',
  'pi-dashboard',
  'pi-error',
  'pi-title',
  'pi-description',
  'pi-details',
  'pi-notifications',
  'pi-item',
  'pi-close',
  'pi-menu',
  'pi-search',
].forEach(name => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        this.classList.add(name);
      }
    },
  );
});
