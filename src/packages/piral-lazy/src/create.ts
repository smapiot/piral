import { Extend } from 'piral-core';
import { createConverter } from './converter';
import { PiletLazyApi } from './types';

export function createLazyApi(): Extend<PiletLazyApi> {
  return context => {
    const convert = createConverter(context);
    context.converters.lazy = ({ load }) => convert(load);

    return {
      fromLazy(load) {
        return {
          type: 'lazy',
          load,
        };
      },
    };
  };
}
