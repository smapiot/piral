import { Extend } from 'piral-core';
import { initialize, addReference, activate, deactivate, attachEvents } from './internal';
import { PiletBlazorApi } from './types';

/**
 * Available configuration options for the Blazor plugin.
 */
export interface BlazorConfig {
  /**
   * Determines if Blazor should only be loaded on demand.
   * @default true
   */
  lazy?: boolean;
}

/**
 * Creates new Pilet API extensions for integration of Blazor.
 */
export function createBlazorApi(config: BlazorConfig = {}): Extend<PiletBlazorApi> {
  const { lazy = true } = config;
  const bootConfig = require('../infra.codegen');
  const boot = () => initialize(bootConfig);

  return context => {
    const root = document.body.appendChild(document.createElement('div'));
    root.style.display = 'none';
    root.id = 'blazor-root';

    let loader = !lazy && boot();

    context.converters.blazor = ({ moduleName, args, dependency }) => {
      let id: string;
      let referenceId: string;
      let node: HTMLElement;
      let dispose = () => {};
      let state: 'fresh' | 'mounted' | 'removed';

      return {
        mount(el, data, ctx) {
          const props = { ...args, ...data };

          (loader || (loader = boot()))
            .then(dependency)
            .then(() => activate(moduleName, props))
            .then(refId => {
              if (state === 'fresh') {
                id = `${moduleName}-${refId}`;
                node = el.appendChild(root.querySelector(`#${id} > div`));
                state = 'mounted';
                referenceId = refId;
              }
            })
            .catch(err => console.error(err));
          dispose = attachEvents(
            el,
            ev => data.piral.renderHtmlExtension(ev.detail.target, ev.detail.props),
            ev => ctx.router.history.push(ev.detail.to),
          );
          state = 'fresh';
        },
        unmount(el) {
          dispose();

          if (state === 'mounted') {
            root.querySelector(`#${id}`).appendChild(node);
            deactivate(moduleName, referenceId);
          }

          el.innerHTML = '';
          state = 'removed';
        },
      };
    };

    return () => {
      let dependency: () => Promise<any>;

      return {
        defineBlazorReferences(references) {
          const load = () =>
            Promise.all(
              references.map(reference =>
                fetch(reference)
                  .then(res => res.blob())
                  .then(addReference),
              ),
            );
          let result = !lazy && loader.then(load);
          dependency = () => result || (result = load());
        },
        fromBlazor(moduleName, args) {
          return {
            type: 'blazor',
            dependency,
            moduleName,
            args,
          };
        },
      };
    };
  };
}
