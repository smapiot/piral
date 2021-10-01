import type { ForeignComponent, BaseComponentProps, Disposable } from 'piral-core';
import { enqueue } from './queue';
import { createExtension } from './extension';
import { createDefineModule, createSharedModule } from './module';
import { bootstrap, prepareBootstrap } from './bootstrap';
import { NgModuleDefiner, PrepareBootstrapResult } from './types';

export interface NgConverterOptions {
  /**
   * Defines the name of the extension component.
   * @default extension-component
   */
  selector?: string;
}

export interface NgConverter {
  <TProps extends BaseComponentProps>(component: any, moduleRef?: string): ForeignComponent<TProps>;
  Extension: any;
  defineModule: NgModuleDefiner;
}

export function createConverter(config: NgConverterOptions = {}): NgConverter {
  const { selector = 'extension-component' } = config;
  const Extension = createExtension(selector);
  const SharedModule = createSharedModule(Extension);
  const defineModule = createDefineModule(SharedModule);
  const convert = <TProps extends BaseComponentProps>(component: any, moduleRef?: string): ForeignComponent<TProps> => {
    let mounted: Promise<void | Disposable> = Promise.resolve();
    let bootstrapped: PrepareBootstrapResult = undefined;
    let active = true;

    return {
      mount(el, props, ctx) {
        const { piral } = props;
        active = true;

        if (!bootstrapped) {
          bootstrapped = prepareBootstrap(piral, component, moduleRef, defineModule);
        }

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
