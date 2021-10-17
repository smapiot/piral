import type { ForeignComponent, BaseComponentProps, Disposable } from 'piral-core';
import type { NgModuleDefiner } from './types';
import { enqueue } from './queue';
import { defineModule } from './module';
import { NgExtension } from './extension';
import { bootstrap, prepareBootstrap } from './bootstrap';

export interface NgConverterOptions {}

export interface NgConverter {
  <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps>;
  defineModule: NgModuleDefiner;
  Extension: any;
}

export function createConverter(_: NgConverterOptions = {}): NgConverter {
  const convert = <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps> => {
    const bootstrapped = prepareBootstrap(component);
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
  convert.Extension = NgExtension;
  return convert;
}
