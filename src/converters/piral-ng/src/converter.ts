import { NgModuleRef, NgModule } from '@angular/core';
import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';

let next = ~~(Math.random() * 10000);

export function createConverter(selectId = () => `ng-${next++}`, moduleOptions: Omit<NgModule, 'boostrap'> = {}) {
  const convert = <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps> => {
    const id = selectId();
    let result: Promise<void | NgModuleRef<any>> = Promise.resolve();

    return {
      mount(el, props, ctx) {
        result = enqueue(() => bootstrap(ctx, props, component, el, id, moduleOptions));
      },
      unmount() {
        result.then((ngMod) => ngMod && ngMod.destroy());
      },
    };
  };
  return convert;
}
