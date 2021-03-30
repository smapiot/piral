import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { addGlobalEventListeners, attachEvents, removeGlobalEventListeners } from './events';
import { activate, deactivate, initialize } from './interop';

export function createConverter(publicPath: string | undefined, lazy: boolean) {
  const bootConfig = require('../infra.codegen');
  const boot = () => initialize(bootConfig, publicPath);
  const root = document.body.appendChild(document.createElement('div'));
  let loader = !lazy && boot();

  root.style.display = 'none';
  root.id = 'blazor-root';

  const convert = <TProps extends BaseComponentProps>(
    moduleName: string,
    dependency: () => Promise<void>,
    args: Record<string, any>,
  ): ForeignComponent<TProps> => {
    let id: string;
    let referenceId: string;
    let node: HTMLElement;
    let dispose = () => {};
    let state: 'fresh' | 'mounted' | 'removed';

    return {
      mount(el, data, ctx) {
        const props = { ...args, ...data };
        el.setAttribute('data-blazor-pilet-root', 'true');

        addGlobalEventListeners(el);

        (loader || (loader = boot()))
          .then(dependency)
          .then(() => activate(moduleName, props))
          .then((refId) => {
            if (state === 'fresh') {
              id = `${moduleName}-${refId}`;
              node = el.appendChild(root.querySelector(`#${id} > div`));
              state = 'mounted';
              referenceId = refId;
            }
          })
          .catch((err) => console.error(err));
        dispose = attachEvents(
          el,
          (ev) => data.piral.renderHtmlExtension(ev.detail.target, ev.detail.props),
          (ev) =>
            ev.detail.replace
              ? ctx.router.history.replace(ev.detail.to, ev.detail.store)
              : ctx.router.history.push(ev.detail.to, ev.detail.state),
        );
        state = 'fresh';
      },
      unmount(el) {
        removeGlobalEventListeners(el);
        el.removeAttribute('data-blazor-pilet-root');
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

  convert.loader = loader;
  return convert;
}
