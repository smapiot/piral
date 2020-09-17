import { lazy } from 'react';
import { PiralPlugin, withApi, HtmlComponent } from 'piral-core';
import { PiletLazyApi, LazyDependencyLoader } from './types';

interface DependencyCache {
  [name: string]: {
    result: Promise<any>;
    loader: LazyDependencyLoader;
  };
}

export function createLazyApi(): PiralPlugin<PiletLazyApi> {
  return (context) => {
    return (api) => {
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
      const wrapComponent = <T>(comp: HtmlComponent<T>) => ({
        default: withApi(context.converters, comp, api, 'unknown'),
      });

      return {
        defineDependency(name, loader) {
          cache[name] = {
            loader,
            result: undefined,
          };
        },
        fromLazy(load, deps = []) {
          return lazy(() => Promise.all(deps.map(getDependency)).then(load).then(wrapComponent));
        },
      };
    };
  };
}
