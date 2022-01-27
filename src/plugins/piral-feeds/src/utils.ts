import { isfunc } from 'piral-core';
import { FeedResolver, FeedConnectorOptions, ConnectorDetails } from './types';

const noop = () => {};

export function createFeedOptions<TData, TItem>(
  id: string,
  resolver: FeedResolver<TData> | FeedConnectorOptions<TData, TItem>,
): ConnectorDetails<TData, TItem> {
  if (isfunc(resolver)) {
    return {
      id,
      initialize() {
        return resolver();
      },
      connect() {
        return noop;
      },
      update(data) {
        return Promise.resolve(data);
      },
      immediately: false,
      reducers: {},
    };
  } else {
    return {
      id,
      initialize() {
        return resolver.initialize();
      },
      connect(cb) {
        if (typeof resolver.connect === 'function') {
          return resolver.connect(cb);
        } else {
          return noop;
        }
      },
      update(data, item) {
        if (typeof resolver.update === 'function') {
          return resolver.update(data, item);
        } else {
          return Promise.resolve(data);
        }
      },
      immediately: resolver.immediately,
      reducers: resolver.reducers || {},
    };
  }
}
