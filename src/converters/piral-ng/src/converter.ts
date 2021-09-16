import type { NgModule } from '@angular/core';
import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { createExtension } from './extension';
import { enqueue } from './queue';
import { bootstrap, NgModuleInt } from './bootstrap';
import { NgOptions } from './types';

let next = ~~(Math.random() * 10000);

export interface NgConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
  /**
   * Defines how the next ID for mounting is selected.
   * By default a random number is used in conjunction with a `ng-` prefix.
   */
  selectId?(): string;
  /**
   * Defines the module options to apply when bootstrapping a component.
   */
  moduleOptions?: Omit<NgModule, 'bootstrap'>;
}

export function createConverter(config: NgConverterOptions = {}) {
  const { selectId = () => `ng-${next++}`, moduleOptions = {}, selector = 'extension-component' } = config;
  const Extension = createExtension(selector);
  const convert = <TProps extends BaseComponentProps>(component: any, opts?: NgOptions): ForeignComponent<TProps> => {
    let result: Promise<void | NgModuleInt> = Promise.resolve();
    let active = true;

    return {
      mount(el, props, ctx) {
        const id = selectId();
        result = enqueue(() => active && bootstrap(ctx, props, component, el, id, moduleOptions, Extension, opts));
      },
      unmount() {
        active = false;
        result.then((ngMod) => ngMod && !ngMod._destroyed && ngMod.destroy());
      },
    };
  };
  convert.Extension = Extension;
  return convert;
}
