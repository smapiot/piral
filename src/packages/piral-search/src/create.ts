import { isfunc } from 'react-arbiter';
import { PiletApi, buildName, PiletMetadata, GlobalStateContext } from 'piral-core';
import { SearchProvider, SearchSettings, PiletSearchApi } from './types';

const noop = () => {};

function addSearchProvider(
  context: GlobalStateContext,
  api: PiletApi,
  id: string,
  provider: SearchProvider,
  settings: SearchSettings,
) {
  const { onlyImmediate = false, onCancel, onClear } = settings;
  context.registerSearchProvider(id, {
    onlyImmediate,
    cancel: isfunc(onCancel) ? onCancel : noop,
    clear: isfunc(onClear) ? onClear : noop,
    search(q) {
      return provider(q, api);
    },
  });
}

export function createSearchApi(api: PiletApi, target: PiletMetadata, context: GlobalStateContext): PiletSearchApi {
  let next = 0;
  return {
    registerSearchProvider(name, provider, settings?) {
      if (typeof name !== 'string') {
        settings = provider;
        provider = name;
        name = next++;
      }

      const id = buildName(target.name, name);
      addSearchProvider(context, api, id, provider, settings || {});
    },
    unregisterSearchProvider(name) {
      const id = buildName(target.name, name);
      context.unregisterSearchProvider(id);
    },
  };
}
