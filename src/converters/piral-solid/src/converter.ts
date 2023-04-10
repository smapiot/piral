import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { Component, onCleanup } from 'solid-js';
import { render, createComponent } from 'solid-js/web';
import { createExtension } from './extension';

export interface SolidConverterOptions {
  /**
   * Defines the name of the root element.
   * @default piral-slot
   */
  rootName?: string;
}

export function createConverter(config: SolidConverterOptions = {}) {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps>(root: Component<TProps>): ForeignComponent<TProps> => ({
    mount(el, props, context, locals) {
      locals.update = (props, context) => {
        locals.destroy = render(() => {
          onCleanup(() => {
            el.innerHTML = '';
          });
          return createComponent(root, { context, ...props });
        }, el);
      };

      locals.update(props, context);
    },
    update(el, props, context, locals) {
      locals.destroy();
      locals.update(props, context);
    },
    unmount(el, locals) {
      locals.destroy();
    },
  });
  convert.Extension = Extension;
  return convert;
}
