import * as actions from './actions';
import { isfunc } from 'react-arbiter';
import { PiletApi, buildName, PiletMetadata, GlobalStateContext } from 'piral-core';
import { PiletSearchApi } from './types';

const noop = () => {};

export function createSearchApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletSearchApi {
  let next = 0;
  context.withActions(actions);

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
}
