import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { addGlobalEventListeners, attachEvents, removeGlobalEventListeners } from './events';
import { activate, deactivate, createBootLoader } from './interop';
import { BlazorOptions } from './types';

const mediaRules = [
  { attribute: 'src', selector: 'img, embed, video > source, video > track, audio > source' },
  { attribute: 'srcset', selector: 'picture > source' },
];

function prefixMediaSources(component: Element, prefix: string) {
  const prefixAttributeValue = (el: Element, attr: string) => el.setAttribute(attr, prefix + el.getAttribute(attr));

  for (const { attribute, selector } of mediaRules) {
    Array.from(component.querySelectorAll(selector))
      .filter((el) => el.hasAttribute(attribute) && !el.getAttribute(attribute).match(/^https?:/))
      .forEach((el) => prefixAttributeValue(el, attribute));
  }
}

function project(component: Element, destination: Element, options: BlazorOptions) {
  options?.resourcePathRoot && prefixMediaSources(component, options.resourcePathRoot);
  destination.appendChild(component);
}

interface BlazorLocals {
  id: string;
  referenceId: string;
  node: HTMLElement;
  dispose(): void;
  state: 'fresh' | 'mounted' | 'removed';
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
  ): ForeignComponent<TProps> => ({
    mount(el, data, ctx, locals: BlazorLocals) {
      const props = { ...args, ...data };
      el.setAttribute('data-blazor-pilet-root', 'true');

      addGlobalEventListeners(el);

      locals.state = 'fresh';
      locals.dispose = attachEvents(
        el,
        (ev) => data.piral.renderHtmlExtension(ev.detail.target, ev.detail.props),
        (ev) =>
          ev.detail.replace
            ? ctx.router.history.replace(ev.detail.to, ev.detail.store)
            : ctx.router.history.push(ev.detail.to, ev.detail.state),
      );

      (loader || (loader = boot()))
        .then(dependency)
        .then(() => activate(moduleName, props))
        .then((refId) => {
          if (locals.state === 'fresh') {
            locals.id = refId;
            locals.node = root.querySelector(`#${locals.id} > div`);
            project(locals.node, el, options);
            locals.state = 'mounted';
            locals.referenceId = refId;
          }
        })
        .catch((err) => console.error(err));
    },
    unmount(el, locals: BlazorLocals) {
      removeGlobalEventListeners(el);
      el.removeAttribute('data-blazor-pilet-root');
      locals.dispose();

      if (locals.state === 'mounted') {
        root.querySelector(`#${locals.id}`).appendChild(locals.node);
        deactivate(moduleName, locals.referenceId);
      }

      el.innerHTML = '';
      locals.state = 'removed';
    },
  });

  convert.loader = loader;
  return convert;
}
