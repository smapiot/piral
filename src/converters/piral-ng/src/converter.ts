import type { ForeignComponent, BaseComponentProps, Disposable } from 'piral-core';
import type { NgModuleDefiner } from './types';
import { enqueue } from './queue';
import { createExtension } from './extension';
import { createDefineModule, createSharedModule } from './module';
import { bootstrap, prepareBootstrap } from './bootstrap';

export interface NgConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
}

export interface NgConverter {
  <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps>;
  Extension: any;
  defineModule: NgModuleDefiner;
}

export function createConverter(config: NgConverterOptions = {}): NgConverter {
  const { selector = 'extension-component' } = config;
  const Extension = createExtension(selector);
  const SharedModule = createSharedModule(Extension);
  const defineModule = createDefineModule(SharedModule);
  const convert = <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps> => {
    const bootstrapped = prepareBootstrap(component, defineModule);
    let mounted: Promise<void | Disposable> = Promise.resolve();
    let active = true;

    return {
      mount(el, props, ctx) {
        active = true;
        mounted = mounted.then(() => enqueue(() => active && bootstrap(bootstrapped, el, props, ctx)));
      },
      unmount() {
        active = false;
        mounted = mounted.then((dispose) => dispose && dispose());
      },
    };
  };
  convert.defineModule = defineModule;
  convert.Extension = Extension;
  return convert;
}
