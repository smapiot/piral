import { isfunc } from 'react-arbiter';
import { FeedResolver, FeedConnectorOptions, ConnectorDetails } from './types';

export function createFeedOptions<TData, TItem>(
  id: string,
  resolver: FeedResolver<TData> | FeedConnectorOptions<TData, TItem>,
): ConnectorDetails<TData, TItem> {
  if (isfunc(resolver)) {
    return {
      id,
      connect() {
        return () => {};
      },
      initialize() {
        return resolver();
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
        return resolver.initialize();
      },
      update(data, item) {
        return resolver.update(data, item);
      },
      immediately: resolver.immediately,
    };
  }
}
