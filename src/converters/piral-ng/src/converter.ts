import type { ForeignComponent, BaseComponentProps, Disposable } from 'piral-core';
import type { NgModuleDefiner, PrepareBootstrapResult } from './types';
import { NgExtension } from './NgExtension';
import { enqueue } from './queue';
import { defineModule } from './module';
import { bootstrap, prepareBootstrap } from './bootstrap';

export interface NgConverterOptions {}

export interface NgConverter {
  <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps>;
  defineModule: NgModuleDefiner;
  Extension: any;
}

interface NgState {
  queued: Promise<void | Disposable>;
  active: boolean;
}

export function createConverter(_: NgConverterOptions = {}): NgConverter {
  const registry = new Map<any, PrepareBootstrapResult>();
  const convert = <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals: NgState) {
      locals.active = true;

      if (!registry.has(component)) {
        registry.set(component, prepareBootstrap(component, props.piral));
      }

      if (!locals.queued) {
        locals.queued = Promise.resolve();
      }

      locals.queued = locals.queued.then(() =>
        enqueue(() => locals.active && bootstrap(registry.get(component), el, props, ctx)),
      );
    },
    unmount(el, locals: NgState) {
      locals.active = false;
      locals.queued = locals.queued.then((dispose) => dispose && dispose());
    },
  });
  convert.defineModule = defineModule;
  convert.Extension = NgExtension;
  return convert;
}
