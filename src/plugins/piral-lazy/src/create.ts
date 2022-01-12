import { lazy, createElement, ComponentType } from 'react';
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

      return {
        defineDependency(name, loader) {
          cache[name] = {
            loader,
            result: undefined,
          };
        },
        fromLazy(load, deps = []) {
          return lazy(() =>
            Promise.all(deps.map(getDependency)).then((values) => {
              const depMap = deps.reduce((obj, name, index) => {
                obj[name] = values[index];
                return obj;
              }, {});
              return load()
                .then((comp) => withApi(context, comp, api, 'unknown'))
                .then((compWithApi) => ({
                  default: (props) => createElement(compWithApi as ComponentType, { deps: depMap, ...props }),
                }));
            }),
          );
        },
      };
    };
  };
}
