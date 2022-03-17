import { ExtensionSlot } from '../components';
import { tryParseJson, noop, reactifyContent, renderInDom, changeDomPortal } from '../utils';
import { Disposable, GlobalStateContext } from '../types';

export interface Updatable {
  (newProps: any): void;
}

if (typeof window !== 'undefined' && 'customElements' in window) {
  class PiralExtension extends HTMLElement {
    dispose: Disposable = noop;
    update: Updatable = noop;
    props = {
      name: this.getAttribute('name'),
      params: tryParseJson(this.getAttribute('params')),
      empty: undefined,
      children: reactifyContent(this.childNodes),
    };

    get params() {
      return this.props.params;
    }

    set params(value) {
      this.props.params = value;
      this.update(this.props);
    }

    get name() {
      return this.props.name;
    }

    set name(value) {
      this.props.name = value;
      this.update(this.props);
    }

    get empty() {
      return this.props.empty;
    }

    set empty(value) {
      this.props.empty = value;
      this.update(this.props);
    }

    connectedCallback() {
      if (this.isConnected) {
        this.dispatchEvent(
          new CustomEvent('render-html', {
            bubbles: true,
            detail: {
              target: this,
              props: this.props,
            },
          }),
        );
      }
    }

    disconnectedCallback() {
      this.dispose();
      this.dispose = noop;
      this.update = noop;
    }

    attributeChangedCallback(name: string, _: any, newValue: any) {
      switch (name) {
        case 'name':
          this.name = newValue;
          break;
        case 'params':
          this.params = tryParseJson(newValue);
          break;
      }
    }

    static get observedAttributes() {
      return ['name', 'params'];
    }
  }

  customElements.define('piral-extension', PiralExtension);
}

export function renderElement(
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  props: any,
): [Disposable, Updatable] {
  let [id, portal] = renderInDom(context, element, ExtensionSlot, props);
  const evName = 'extension-props-changed';
  const handler = (ev: CustomEvent) => update(ev.detail);
  const dispose: Disposable = () => {
    context.hidePortal(id, portal);
    element.removeEventListener(evName, handler);
  };
  const update: Updatable = (newProps) => {
    [id, portal] = changeDomPortal(id, portal, context, element, ExtensionSlot, newProps);
  };
  element.addEventListener(evName, handler);
  return [dispose, update];
}
