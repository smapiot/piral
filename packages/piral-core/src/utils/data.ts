import { DataStoreOptions, CustomDataStoreOptions, Dict, SharedDataItem, DataStoreTarget } from '../types';

const defaultTarget: DataStoreTarget = 'memory';

export function createDataView(data: Dict<SharedDataItem>): Readonly<Dict<any>> {
  const proxyName = 'Proxy';
  return (
    window[proxyName] &&
    new Proxy(data, {
      get(target, name) {
        const item = target[name as string];
        return item && item.value;
      },
      set(_target, _name, _value) {
        return true;
      },
    })
  );
}

export function createDataOptions(options: DataStoreOptions = defaultTarget): CustomDataStoreOptions {
  if (typeof options === 'string') {
    return {
      target: options,
    };
  } else if (options && typeof options === 'object' && !Array.isArray(options)) {
    return options;
  } else {
    return {
      target: defaultTarget,
    };
  }
}

export function getDataExpiration(expires?: number | Date | 'never') {
  if (typeof expires === 'number') {
    return expires;
  } else if (expires instanceof Date) {
    return expires.valueOf();
  }

  return -1;
}
