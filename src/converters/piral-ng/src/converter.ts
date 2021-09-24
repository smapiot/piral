import type { NgModule } from '@angular/core';
import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { enqueue } from './queue';
import { createExtension } from './extension';
import { createDefineModule } from './module';
import { bootstrap, NgModuleInt } from './bootstrap';

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
  const defineModule = createDefineModule();
  const convert = <TProps extends BaseComponentProps>(component: any, moduleRef?: string): ForeignComponent<TProps> => {
    let result: Promise<void | NgModuleInt> = Promise.resolve();
    let active = true;

    return {
      mount(el, props, ctx) {
        active = true;
        result = result.then(() =>
          enqueue(() => active && bootstrap(ctx, props, component, el, selectId(), moduleOptions, Extension)),
        );
      },
      unmount() {
        active = false;
        result = result.then((ngMod) => ngMod && !ngMod._destroyed && ngMod.destroy());
      },
    };
  };
  convert.defineModule = defineModule;
  convert.Extension = Extension;
  return convert;
}
