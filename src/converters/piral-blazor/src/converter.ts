import type { BaseComponentProps, Disposable, ForeignComponent } from 'piral-core';
import { attachLocalEvents } from './events';
import {
  activate,
  deactivate,
  createBootLoader,
  reactivate,
  callNotifyLocationChanged,
  setLanguage,
  createElement,
  destroyElement,
  updateElement,
  setLogLevel,
  processEvent,
} from './interop';
import {
  BlazorDependencyLoader,
  BlazorLogLevel,
  BlazorOptions,
  BlazorRootConfig,
  WebAssemblyStartOptions,
} from './types';
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
  unmount?(): void;
  update?(props: any): void;
  dispose(): void;
  next(config: BlazorRootConfig): void;
  state: 'fresh' | 'mounted' | 'removed';
}

export interface LanguageOptions {
  current: string | undefined;
  onChange(inform: (language: string) => void): void;
}

export function createConverter(
  lazy: boolean,
  opts?: WebAssemblyStartOptions,
  language?: LanguageOptions,
  logLevel?: BlazorLogLevel,
) {
  let configurable = false;
  const bootLoader = createBootLoader(bootConfig.url, bootConfig.satellites);
  const boot = (opts?: WebAssemblyStartOptions) =>
    bootLoader(opts).then(async ({ config, first }) => {
      const [_, capabilities] = config;
      configurable = capabilities.includes('configurable');

      if (typeof logLevel === 'number' && capabilities.includes('logging')) {
        await setLogLevel(logLevel);
      }

      if (first && capabilities.includes('events')) {
        const eventDispatcher = document.body.dispatchEvent;

        // listen to all events for forwarding them
        document.body.dispatchEvent = function (ev: CustomEvent) {
          if (ev.type.startsWith('piral-')) {
            const type = ev.type.replace('piral-', '');
            const args = ev.detail.arg;

            try {
              JSON.stringify(args);
              processEvent(type, args);
            } catch {
              console.warn(`The event "${type}" could not be serialized and will not be handled by Blazor.`);
            }
          }

          return eventDispatcher.call(this, ev);
        };
      }

      if (language && capabilities.includes('language')) {
        if (typeof language.current === 'string') {
          await setLanguage(language.current);
        }

        if (typeof language.onChange === 'function') {
          language.onChange(setLanguage);
        }
      }

      window.dispatchEvent(new CustomEvent('loaded-blazor-core'));
      return config;
    });
  let loader = !lazy && boot(opts);
  let listener: Disposable = undefined;

  const enqueueChange = (locals: BlazorLocals, update: (root: BlazorRootConfig) => void) => {
    if (typeof update !== 'function') {
      // nothing to do in this case
    } else if (locals.state === 'mounted') {
      loader.then(update);
    } else {
      locals.next = update;
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
      const { piral } = data;
      const nav = ctx.navigation;
      el.setAttribute('data-blazor-pilet-root', 'true');

      locals.state = 'fresh';
      locals.next = noop;
      locals.dispose = attachLocalEvents(
        el,
        (ev) => {
          ev.stopPropagation();
          const { target, props, configure } = ev.detail;
          piral.renderHtmlExtension(target, props);
          configurable && configure();
        },
        (ev) => {
          ev.stopPropagation();
          const { to, state, replace } = ev.detail;
          replace ? nav.replace(to, state) : nav.push(to, state);
        },
      );

      function mountClassic(config: BlazorRootConfig) {
        return activate(moduleName, props).then((refId) => {
          const [root] = config;
          const node = root.querySelector(`#${refId} > div`);

          locals.unmount = () => {
            root.querySelector(`#${refId}`)?.appendChild(node);
            deactivate(moduleName, refId);
            el.innerHTML = '';
          };

          locals.update = (props) => {
            reactivate(moduleName, refId, props);
          };

          project(node, el, options);
        });
      }

      function mountModern(_: BlazorRootConfig) {
        return createElement(moduleName, props).then((refId) => {
          const child = document.createElement('piral-blazor-component');
          child.setAttribute('rid', refId);
          el.appendChild(child);

          locals.unmount = () => {
            destroyElement(refId);
            child.remove();
            el.innerHTML = '';
          };

          locals.update = (props) => {
            updateElement(refId, props);
          };
        });
      }

      (loader || (convert.loader = loader = boot(opts)))
        .then((config) => {
          if (listener === undefined) {
            listener = nav.listen(({ location, action }) => {
              // POP is already handled by .NET
              if (action !== 'POP') {
                const url = makeUrl(location.href);
                callNotifyLocationChanged(url, action === 'REPLACE', location.state);
              }
            });
          }

          return config;
        })
        .then((config) =>
          dependency(config).then(() => {
            if (locals.state === 'fresh') {
              const [_, capabilities, applyChanges] = config;
              const fn = capabilities.includes('custom-element') ? mountModern : mountClassic;
              applyChanges(piral);

              return fn(config).then(() => {
                locals.state = 'mounted';
                locals.next(config);
                locals.next = noop;
              });
            }
          }),
        )
        .catch((err) => console.error(err));
    },
    update(el, data, ctx, locals: BlazorLocals) {
      enqueueChange(locals, () => {
        locals.update?.({ ...args, ...data });
      });
    },
    unmount(el, locals: BlazorLocals) {
      el.removeAttribute('data-blazor-pilet-root');
      locals.dispose();
      enqueueChange(locals, locals.unmount);
      locals.state = 'removed';
    },
  });

  convert.boot = () => boot(opts);
  convert.loader = loader;
  convert.lazy = lazy;
  return convert;
}
