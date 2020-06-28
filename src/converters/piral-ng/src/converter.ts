import { NgModuleRef } from '@angular/core';
import { ForeignComponent, BaseComponentProps } from 'piral-core';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';

let next = ~~(Math.random() * 10000);

export function createConverter(selectId = () => `ng-${next++}`) {
  const convert = <TProps extends BaseComponentProps>(component: any): ForeignComponent<TProps> => {
    const id = selectId();
    let result: Promise<void | NgModuleRef<any>> = Promise.resolve();

    return {
      mount(el, props, ctx) {
        result = enqueue(() => bootstrap(ctx, props, component, el, id));
      },
      unmount() {
        result.then(ngMod => ngMod && ngMod.destroy());
      },
    };
  };
  return convert;
}
