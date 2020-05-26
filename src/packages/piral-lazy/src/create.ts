import { Extend } from 'piral-core';
import { createConverter } from './converter';
import { PiletLazyApi, DependencyCache } from './types';

export function createLazyApi(): Extend<PiletLazyApi> {
  return context => {
    const convert = createConverter(context);
    context.converters.lazy = ({ load, deps }) => convert(load, deps);

    return () => {
      const cache: DependencyCache = {};
      const getDependency = (name: string) => {
        const dep = cache[name];

        if (!dep) {
          throw new Error(
            `The given dependency "${name}" cannot be found. Please add it first using "defineDependency"`,
          );
        }

        return dep.result ?? (dep.result = dep.loader());
      };

      return {
        defineDependency(name, loader) {
          cache[name] = {
            loader,
            result: undefined,
          };
        },
        fromLazy(load, deps) {
          return {
            type: 'lazy',
            deps: deps?.map(getDependency),
            load,
          };
        },
      };
    };
  };
}
