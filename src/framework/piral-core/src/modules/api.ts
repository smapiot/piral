import { isfunc, PiletApiCreator, PiletApiExtender, initializeApi, mergeApis } from 'piral-base';
import { __assign } from 'tslib';
import { withApi } from '../state';
import { ExtensionSlot } from '../components';
import { createDataOptions, getDataExpiration, renderInDom, tryParseJson } from '../utils';
import { GlobalStateContext, PiletCoreApi, PiralPlugin } from '../types';

if ('customElements' in window) {
  class PiralExtension extends HTMLElement {
    connectedCallback() {
      if (this.isConnected) {
        const name = this.getAttribute('name');
        const params = tryParseJson(this.getAttribute('params'));
        this.dispatchEvent(
          new CustomEvent('render-html', {
            bubbles: true,
            detail: {
              target: this,
              props: {
                name,
                params,
              },
            },
          }),
        );
      }
    }
  }

  customElements.define('piral-extension', PiralExtension);
}

export function createCoreApi(context: GlobalStateContext): PiletApiExtender<PiletCoreApi> {
  document.body.addEventListener(
    'render-html',
    (ev: CustomEvent) => {
      ev.stopPropagation();
      renderInDom(context, ev.detail.target, ExtensionSlot, ev.detail.props);
    },
    false,
  );

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
        const id = renderInDom(context, element, ExtensionSlot, props);
        return () => context.destroyPortal(id);
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
