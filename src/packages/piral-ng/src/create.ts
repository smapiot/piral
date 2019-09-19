import { PiletApi, PiletMetadata, GlobalStateContext } from 'piral-core';
import { PiletNgApi } from './types';
import { enqueue } from './queue';
import { bootstrap } from './bootstrap';

function getPlatformProps(piral: any, context: any, props: any) {
  return [
    { provide: 'Piral', useValue: piral },
    { provide: 'Props', useValue: props },
    { provide: 'Context', useValue: context },
  ];
}

/**
 * Creates a new set of Piral Angular API extensions.
 * @param api The API to extend.
 */
export function createNgApi(api: PiletApi, _target: PiletMetadata, context: GlobalStateContext): PiletNgApi {
  let next = ~~(Math.random() * 10000);

  context.converters.ng = component => {
    const id = `ng-${next++}`;
    return (el, props, ctx) => {
      enqueue(() => bootstrap(getPlatformProps(api, ctx, props), component, el, id));
    };
  };

  return {};
}
