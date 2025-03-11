import { ExtensionSlot } from '../components';
import { applyStyle } from '../../app.codegen';
import { Disposable, GlobalStateContext, BaseExtensionSlotProps } from '../types';
import {
  tryParseJson,
  noop,
  reactifyContent,
  renderInDom,
  changeDomPortal,
  portalName,
  extensionName,
  slotName,
  isSame,
  contentName,
  componentName,
  defer,
} from '../utils';

export interface Updatable {
  (newProps: any): void;
}

if (typeof window !== 'undefined' && 'customElements' in window) {
  /**
   * This is a nice abstraction allowing anyone to actually use the extension system
   * brought by Piral. Not all props of the extension system are actually exposed.
   *
   * Usage:
   *
   * ```
   * <piral-extension name="my-ext-name"></piral-extension>
   * ```
   */
  class PiralExtension extends HTMLElement {
    dispose: Disposable = noop;
    update: Updatable = noop;

    props = {
      name: this.getAttribute('name'),
      emptySkipsRender: typeof this.getAttribute('empty-skips-render') === 'string',
      params: tryParseJson(this.getAttribute('params')),
      empty: undefined,
      order: undefined,
      render: undefined,
      children: reactifyContent(this.childNodes),
    } as BaseExtensionSlotProps<string, any>;

    get params() {
      return this.props.params;
    }

    set params(value) {
      if (!isSame(this.props.params, value)) {
        this.props.params = value;
        this.update(this.props);
      }
    }

    get name() {
      return this.props.name;
    }

    set name(value) {
      if (this.props.name !== value) {
        this.props.name = value;
        this.update(this.props);
      }
    }

    get order() {
      return this.props.order;
    }

    set order(value) {
      if (this.props.order !== value) {
        this.props.order = value;
        this.update(this.props);
      }
    }

    get render() {
      return this.props.render;
    }

    set render(value) {
      if (this.props.render !== value) {
        this.props.render = value;
        this.update(this.props);
      }
    }

    get empty() {
      return this.props.empty;
    }

    set empty(value) {
      if (this.props.empty !== value) {
        this.props.empty = value;
        this.update(this.props);
      }
    }

    get emptySkipsRender() {
      return this.props.emptySkipsRender;
    }

    set emptySkipsRender(value) {
      if (this.props.emptySkipsRender !== value) {
        this.props.emptySkipsRender = value;
        this.update(this.props);
      }
    }

    connectedCallback() {
      applyStyle(this);

      if (this.isConnected) {
        this.dispatchEvent(
          new CustomEvent('render-html', {
            bubbles: true,
            composed: true,
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
        case 'empty-skips-render':
          this.emptySkipsRender = typeof newValue === 'string';
          break;
      }
    }

    static get observedAttributes() {
      return ['name', 'params', 'empty-skips-render'];
    }
  }

  customElements.define(extensionName, PiralExtension);

  /**
   * This is a boundary to host elements from other frameworks - effectively vanishing
   * at runtime.
   *
   * Usage:
   *
   * ```
   * <piral-portal pid="host-1234"></piral-portal>
   * ```
   */
  class PiralPortal extends HTMLElement {
    connectedCallback() {
      applyStyle(this);
    }
  }

  customElements.define(portalName, PiralPortal);

  /**
   * This is a virtual element to aggregate rendering from other frameworks, mostly
   * used like piral-portal, but without context-hosting capabilities. This would
   * be used exclusively within a foreign framework, not from Piral to initiate.
   *
   * Usage:
   *
   * ```
   * <piral-slot></piral-slot>
   * ```
   */
  class PiralSlot extends HTMLElement {
    connectedCallback() {
      applyStyle(this);
    }
  }

  customElements.define(slotName, PiralSlot);

  /**
   * This is a virtual element to render children defined in React / by Piral in other
   * frameworks.
   *
   * Internally, you can use the assignContent function to populate the content to be
   * rendered once the element is attached / mounted in the DOM.
   *
   * Usage:
   *
   * ```
   * <piral-content cid="123"></piral-content>
   * ```
   *
   * where you'd
   *
   * ```
   * window.assignContent("123", myReactContent)
   * ```
   *
   * beforehand.
   */
  class PiralContent extends HTMLElement {
    dispose: Disposable = noop;

    static contentAssignments = {};

    connectedCallback() {
      applyStyle(this);
      const cid = this.getAttribute('cid');
      const content = PiralContent.contentAssignments[cid];
      const portal = this.closest('piral-portal');

      if (content && portal) {
        const portalId = portal.getAttribute('pid');
        window.dispatchEvent(
          new CustomEvent('render-content', {
            detail: { target: this, content, portalId },
          }),
        );
      }
    }

    disconnectedCallback() {
      this.dispose();
      this.dispose = noop;
    }
  }

  window.assignContent = (cid, content) => {
    PiralContent.contentAssignments[cid] = content;
  };

  customElements.define(contentName, PiralContent);

  /**
   * This is a virtual element to indicate that the contained content is
   * rendered from a micro frontend's component. It will be used by the
   * orchestrator, so there is nothing you will need to do with it.
   *
   * Right now this is only used when you opt-in in the createInstance.
   */
  class PiralComponent extends HTMLElement {
    get name() {
      return this.getAttribute('name');
    }

    set name(value: string) {
      this.setAttribute('name', value);
    }

    get origin() {
      return this.getAttribute('origin');
    }

    set origin(value: string) {
      this.setAttribute('origin', value);
    }

    connectedCallback() {
      applyStyle(this);
      this.deferEvent('add-component');
    }

    disconnectedCallback() {
      this.deferEvent('remove-component');
    }

    deferEvent(eventName: string) {
      const ev = new CustomEvent(eventName, {
        detail: { name: this.name, origin: this.origin },
      });
      defer(() => window.dispatchEvent(ev));
    }
  }

  customElements.define(componentName, PiralComponent);
}

export function renderElement(
  context: GlobalStateContext,
  element: HTMLElement | ShadowRoot,
  props: any,
): [Disposable, Updatable] {
  if (typeof window !== 'undefined') {
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

  return [noop, noop];
}
