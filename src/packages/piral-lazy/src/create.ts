import {
  Extend,
  PiralLoadingIndicator,
  renderInDom,
  convertComponent,
  ForeignComponent,
  ComponentContext,
} from 'piral-core';
import { PiletLazyApi } from './types';

export function createLazyApi(): Extend<PiletLazyApi> {
  return context => {
    context.converters.lazy = ({ load }) => {
      let present: [HTMLElement, any, ComponentContext] = undefined;
      let portalId: string = undefined;
      const promise =
        load.current || (load.current = load().then(c => convertComponent(context.converters[c.type], c)));
      const component: ForeignComponent<any> = {
        mount(...args) {
          portalId = renderInDom(context, args[0], PiralLoadingIndicator, {});
          present = args;
        },
        update(...args) {
          present = args;
        },
        unmount() {
          portalId = undefined;
          present = undefined;
        },
      };
      promise.then(({ mount, unmount, update }) => {
        portalId && context.destroyPortal(portalId);
        component.mount = mount;
        component.unmount = unmount;
        component.update = update;
        present && mount(...present);
      });
      return component;
    };

    return {
      fromLazy(load) {
        return {
          type: 'lazy',
          load,
        };
      },
    };
  };
}
