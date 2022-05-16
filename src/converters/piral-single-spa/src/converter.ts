import type { ForeignComponent, BaseComponentProps } from 'piral-core';
import { SingleSpaAppProps, SingleSpaLifecycle, SingleSpaLifeCycleFn } from './types';

function normalize<TProps>(
  fn: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>,
): Array<SingleSpaLifeCycleFn<TProps>> {
  if (Array.isArray(fn)) {
    return fn;
  } else if (typeof fn === 'function') {
    return [fn];
  }

  return [];
}

function runAll<TProps>(
  fn: SingleSpaLifeCycleFn<TProps> | Array<SingleSpaLifeCycleFn<TProps>>,
  props: TProps & SingleSpaAppProps,
): Promise<void> {
  const fns = normalize(fn);
  return Promise.all(fns.map((fn) => fn(props))).then(() => {});
}

export interface SingleSpaConverterOptions {}

export function createConverter(config: SingleSpaConverterOptions = {}) {
  const {} = config;
  const bootstrapped: Array<SingleSpaLifecycle<any>> = [];
  const convert = <TProps extends BaseComponentProps>(
    lifecycle: SingleSpaLifecycle<TProps>,
  ): ForeignComponent<TProps> => ({
    mount(domElement, props, ctx, locals) {
      const { piral } = props;
      const opts = { ...props, domElement, name: piral.meta.name, singleSpa: undefined, mountParcel: undefined };

      if (!locals.promise) {
        locals.promise = Promise.resolve();
      }

      if (!bootstrapped.includes(lifecycle)) {
        bootstrapped.push(lifecycle);
        locals.promise = locals.promise.then(() => runAll(lifecycle.bootstrap, opts));
      }

      locals.promise = locals.promise.then(() => runAll(lifecycle.mount, opts));
    },
    update(domElement, data, ctx, locals) {},
    unmount(domElement, locals) {},
  });
  return convert;
}
