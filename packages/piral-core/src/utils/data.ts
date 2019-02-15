import { DataStoreOptions, CustomDataStoreOptions, Dict, SharedDataItem } from '../types';

export function createDataView(data: Dict<SharedDataItem>) {
  const proxyName = 'Proxy';
  return window[proxyName]
    ? new Proxy(data, {
        get(target, name) {
          const item = target[name as string];
          return item && item.value;
        },
        set(_target, _name, _value) {
          return true;
        },
      })
    : data;
}

export function createDataOptions(options: DataStoreOptions = 'memory'): CustomDataStoreOptions {
  if (typeof options === 'string') {
    return {
      target: options,
    };
  } else if (typeof options === 'object') {
    return options;
  } else {
    return {};
  }
}

export function getDataExpiration(expires?: number | Date | 'never') {
  if (typeof expires === 'number') {
    return expires;
  } else if (typeof expires === 'object') {
    return expires.valueOf();
  }

  return -1;
}
