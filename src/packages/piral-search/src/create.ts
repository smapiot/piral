import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { isfunc } from 'react-arbiter';
import { buildName, Extend } from 'piral-core';
import { PiletSearchApi } from './types';

/**
 * Creates a new set of Piral API extensions for search and filtering.
 */
export function createSearchApi(): Extend<PiletSearchApi> {
  const noop = () => {};

  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      components: {
        ...state.components,
        searchProviders: {},
      },
      search: {
        input: '',
        loading: false,
        results: [],
      },
    }));

    return (api, target) => {
      let next = 0;

      return {
        registerSearchProvider(name, provider, settings?) {
          if (typeof name !== 'string') {
            settings = provider;
            provider = name;
            name = next++;
          }

          const id = buildName(target.name, name);
          const { onlyImmediate = false, onCancel = noop, onClear = noop } = settings || {};
          context.registerSearchProvider(id, {
            onlyImmediate,
            cancel: isfunc(onCancel) ? onCancel : noop,
            clear: isfunc(onClear) ? onClear : noop,
            search(q) {
              return provider(q, api);
            },
          });
        },
        unregisterSearchProvider(name) {
          const id = buildName(target.name, name);
          context.unregisterSearchProvider(id);
        },
      };
    };
  };
}
