import * as actions from './actions';
import { isfunc } from 'react-arbiter';
import { buildName, ApiExtender, GlobalStateContext } from 'piral-core';
import { PiletSearchApi } from './types';

const noop = () => {};

export function createSearchApi(context: GlobalStateContext): ApiExtender<PiletSearchApi> {
  context.defineActions(actions);

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
}
