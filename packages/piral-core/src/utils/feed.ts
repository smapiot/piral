import { FeedResolver, FeedConnectorOptions, ConnectorDetails } from '../types';

export function createFeedOptions<TData, TItem>(
  id: string,
  resolver: FeedResolver<TData> | FeedConnectorOptions<TData, TItem>,
): ConnectorDetails<TData, TItem> {
  let initialized: Promise<TData>;

  if (typeof resolver === 'function') {
    return {
      id,
      connect() {
        return () => {};
      },
      initialize() {
        return initialized || (initialized = resolver());
      },
      update(data) {
        return Promise.resolve(data);
      },
      immediately: false,
    };
  } else {
    return {
      id,
      connect(cb) {
        return resolver.connect(cb);
      },
      initialize() {
        return initialized || (initialized = resolver.initialize());
      },
      update(data, item) {
        return resolver.update(data, item);
      },
      immediately: resolver.immediately,
    };
  }
}
