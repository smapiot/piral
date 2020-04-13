import { Extend } from 'piral-core';
import { initializeBlazor, eventNames } from './internal';
import { PiletBlazorApi } from './types';

/**
 * Available configuration options for the Blazor plugin.
 */
export interface BlazorConfig {}

/**
 * Creates new Pilet API extensions for integration of Blazor.
 */
export function createBlazorApi(config: BlazorConfig = {}): Extend<PiletBlazorApi> {
  return context => {
    const root = document.body.appendChild(document.createElement('div'));
    root.style.display = 'none';
    root.id = 'blazor-root';

    let loader: Promise<any>;

    context.converters.blazor = ({ moduleName, args }) => {
      let id: string;
      let referenceId: string;
      let node: HTMLElement;
      let renderHandler: (ev: CustomEvent) => void;
      let navigateHandler: (ev: CustomEvent) => void;
      let state: 'fresh' | 'mounted' | 'removed';

      return {
        mount(el, data, ctx) {
          const props = { ...args, ...data };
          loader
            .then(() => DotNet.invokeMethodAsync<string>('NewBlazorApp', 'Activate', moduleName, props))
            .then(refId => {
              if (state === 'fresh') {
                id = `${moduleName}-${refId}`;
                node = el.appendChild(root.querySelector(`#${id} > div`));
                state = 'mounted';
                referenceId = refId;
              }
            })
            .catch(err => console.error(err));
          renderHandler = ev => data.piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          navigateHandler = ev => ctx.router.history.push(ev.detail.to);
          el.addEventListener(eventNames.render, renderHandler, false);
          el.addEventListener(eventNames.navigate, navigateHandler, false);
          state = 'fresh';
        },
        unmount(el) {
          el.removeEventListener(eventNames.render, renderHandler, false);
          el.removeEventListener(eventNames.navigate, navigateHandler, false);

          if (state === 'mounted') {
            root.querySelector(`#${id}`).appendChild(node);
            DotNet.invokeMethodAsync('NewBlazorApp', 'Deactivate', moduleName, referenceId);
          }

          el.innerHTML = '';
          state = 'removed';
        },
      };
    };

    return {
      setupBlazor(cfg) {
        cfg.cacheBootResources = false;
        loader = initializeBlazor(cfg);
      },
      fromBlazor(moduleName, args) {
        return {
          type: 'blazor',
          moduleName,
          args,
        };
      },
    };
  };
}
