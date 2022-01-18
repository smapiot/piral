import { isfunc, PiletApiCreator, PiletApiExtender, initializeApi, mergeApis } from 'piral-base';
import { __assign } from 'tslib';
import { withApi } from '../state';
import { ExtensionSlot } from '../components';
import { createDataOptions, getDataExpiration, renderInDom, tryParseJson, changeDomPortal, noop } from '../utils';
import { Disposable, GlobalStateContext, PiletCoreApi, PiralPlugin } from '../types';

interface Updatable {
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

function render(context: GlobalStateContext, element: HTMLElement | ShadowRoot, props: any): [Disposable, Updatable] {
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

export function createCoreApi(context: GlobalStateContext): PiletApiExtender<PiletCoreApi> {
  if (typeof document !== 'undefined') {
    document.body.addEventListener(
      'render-html',
      (ev: CustomEvent) => {
        ev.stopPropagation();
        const container = ev.detail.target;
        const [dispose, update] = render(context, container, ev.detail.props);
        container.dispose = dispose;
        container.update = update;
      },
      false,
    );
  }

  return (api, target) => {
    const pilet = target.name;
    return {
      getData(name) {
        return context.readDataValue(name);
      },
      setData(name, value, options) {
        const { target = 'memory', expires } = createDataOptions(options);
        const expiration = getDataExpiration(expires);
        return context.tryWriteDataItem(name, value, pilet, target, expiration);
      },
      registerPage(route, arg, meta) {
        context.registerPage(route, {
          pilet,
          meta,
          component: withApi(context, arg, api, 'page'),
        });
        return () => api.unregisterPage(route);
      },
      unregisterPage(route) {
        context.unregisterPage(route);
      },
      registerExtension(name, arg, defaults) {
        context.registerExtension(name as string, {
          pilet,
          component: withApi(context, arg, api, 'extension'),
          reference: arg,
          defaults,
        });
        return () => api.unregisterExtension(name, arg);
      },
      unregisterExtension(name, arg) {
        context.unregisterExtension(name as string, arg);
      },
      renderHtmlExtension(element, props) {
        const [dispose] = render(context, element, props);
        return dispose;
      },
      Extension: ExtensionSlot,
    };
  };
}

export function createExtenders(context: GlobalStateContext, apis: Array<PiralPlugin>) {
  const creators: Array<PiralPlugin> = [createCoreApi, ...apis.filter(isfunc)];
  return creators.map((c) => {
    const ctx = c(context);

    if (isfunc(ctx)) {
      return ctx;
    } else {
      return () => ({
        ...ctx,
      });
    }
  });
}

export function defaultApiFactory(context: GlobalStateContext, apis: Array<PiralPlugin>): PiletApiCreator {
  const extenders = createExtenders(context, apis);
  return (target) => {
    const api = initializeApi(target, context);
    context.apis[target.name] = api;
    return mergeApis(api, extenders, target);
  };
}
