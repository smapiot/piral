import type { BaseComponentProps, Disposable, ForeignComponent } from 'piral-core';
import { addGlobalEventListeners, attachEvents, removeGlobalEventListeners } from './events';
import { activate, deactivate, createBootLoader, reactivate, callNotifyLocationChanged } from './interop';
import { BlazorDependencyLoader, BlazorOptions, BlazorRootConfig } from './types';
import bootConfig from '../infra.codegen';

const noop = () => {};

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
  if (options?.resourcePathRoot && !bootConfig.noMutation) {
    prefixMediaSources(component, options.resourcePathRoot);
  }

  destination.appendChild(component);
}

function makeUrl(href: string) {
  const origin = document.location.origin;

  if (!href.startsWith(origin)) {
    return `${origin}${href}`;
  }

  return href;
}

interface BlazorLocals {
  id: string;
  referenceId: string;
  node: HTMLElement;
  dispose(): void;
  update(config: BlazorRootConfig): void;
  state: 'fresh' | 'mounted' | 'removed';
}

export function createConverter(lazy: boolean) {
  const boot = createBootLoader(bootConfig.url, bootConfig.satellites);
  let loader = !lazy && boot();
  let listener: Disposable = undefined;

  const enqueueChange = (locals: BlazorLocals, update: (root: BlazorRootConfig) => void) => {
    if (locals.state === 'mounted') {
      loader.then(update);
    } else {
      locals.update = update;
    }
  };

  const convert = <TProps extends BaseComponentProps>(
    moduleName: string,
    dependency: BlazorDependencyLoader,
    args: Record<string, any>,
    options?: BlazorOptions,
  ): ForeignComponent<TProps> => ({
    mount(el, data, ctx, locals: BlazorLocals) {
      const props = { ...args, ...data };
      const nav = ctx.navigation;
      el.setAttribute('data-blazor-pilet-root', 'true');

      addGlobalEventListeners(el);

      if (listener === undefined) {
        listener = nav.listen(({ location, action }) => {
          // POP is already handled by .NET
          if (action !== 'POP') {
            const url = makeUrl(location.href);
            callNotifyLocationChanged(url, action === 'REPLACE');
          }
        });
      }

      locals.state = 'fresh';
      locals.update = noop;
      locals.dispose = attachEvents(
        el,
        (ev) => data.piral.renderHtmlExtension(ev.detail.target, ev.detail.props),
        (ev) =>
          ev.detail.replace ? nav.replace(ev.detail.to, ev.detail.store) : nav.push(ev.detail.to, ev.detail.state),
      );

      (loader || (loader = boot()))
        .then((config) =>
          dependency(config)
            .then(() => activate(moduleName, props))
            .then((refId) => {
              const [root] = config;

              if (locals.state === 'fresh') {
                locals.id = refId;
                locals.node = root.querySelector(`#${locals.id} > div`);
                project(locals.node, el, options);
                locals.state = 'mounted';
                locals.referenceId = refId;
                locals.update(config);
                locals.update = noop;
              }
            }),
        )
        .catch((err) => console.error(err));
    },
    update(el, data, ctx, locals: BlazorLocals) {
      enqueueChange(locals, () => {
        const props = { ...args, ...data };
        reactivate(moduleName, locals.referenceId, props);
      });
    },
    unmount(el, locals: BlazorLocals) {
      removeGlobalEventListeners(el);
      el.removeAttribute('data-blazor-pilet-root');
      locals.dispose();

      enqueueChange(locals, ([root]) => {
        root.querySelector(`#${locals.id}`)?.appendChild(locals.node);
        deactivate(moduleName, locals.referenceId);
        el.innerHTML = '';
      });

      locals.state = 'removed';
    },
  });

  convert.loader = loader;
  return convert;
}
