import { PiletApiExtender } from 'piral-base';
import { renderElement } from './element';
import { withApi } from '../state';
import { ExtensionSlot } from '../components';
import { createDataOptions, getDataExpiration } from '../utils';
import { GlobalStateContext, PiletCoreApi } from '../types';

export function createCoreApi(context: GlobalStateContext): PiletApiExtender<PiletCoreApi> {
  return (api, meta) => {
    const pilet = meta.name;
    return {
      getData(name) {
        return context.readDataValue(name);
      },
      setData(name, value, options) {
        const { target = 'memory', expires } = createDataOptions(options);
        const expiration = getDataExpiration(expires);
        return context.tryWriteDataItem(name, value, pilet, target, expiration);
      },
      registerPage(route, arg, meta = {}) {
        const component = withApi(context, arg, api, 'page', undefined, { meta });
        context.registerPage(route, {
          pilet,
          meta,
          component,
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
        const [dispose] = renderElement(context, element, props);
        return dispose;
      },
      Extension: ExtensionSlot,
    };
  };
}
