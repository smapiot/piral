import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { addGlobalEventListeners, attachEvents, removeGlobalEventListeners } from './events';
import { activate, deactivate, createBootLoader } from './interop';
import { BlazorOptions } from './types';

const mediaRules = [
  { attribute: 'src', selector: 'img, embed, video > source, video > track, audio > source' },
  { attribute: 'srcset', selector: 'picture > source' },
];

function prefixMediaSources(component: Element, prefix: string) {
  const prefixAttributeValue = (el, attr) => el.setAttribute(attr, prefix + el.getAttribute(attr));

  for (const { attribute, selector } of mediaRules) {
    Array.from(component.querySelectorAll(selector))
      .filter((el) => el.hasAttribute(attribute) && !el.getAttribute(attribute).match(/^https?:/))
      .forEach((el) => prefixAttributeValue(el, attribute));
  }
}

function project(component: Element, destination: Element, options: BlazorOptions): Element {
  options?.resourcePathRoot && prefixMediaSources(component, options.resourcePathRoot);
  return destination.appendChild(component);
}

export function createConverter(lazy: boolean) {
  const bootConfig = require('../infra.codegen');
  const boot = createBootLoader(bootConfig);
  const root = document.body.appendChild(document.createElement('div'));
  let loader = !lazy && boot();

  root.style.display = 'none';
  root.id = 'blazor-root';

  const convert = <TProps extends BaseComponentProps>(
    moduleName: string,
    dependency: () => Promise<void>,
    args: Record<string, any>,
    options?: BlazorOptions,
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
              id = refId;
              const component = root.querySelector('#' + id + ' > div');
              node = project(component, el, options) as HTMLElement;
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
