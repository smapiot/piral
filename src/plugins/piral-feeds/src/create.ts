import * as actions from './actions';
import { buildName, PiralPlugin } from 'piral-core';
import { withFeed } from './withFeed';
import { createFeedOptions } from './utils';
import { PiletFeedsApi, FeedConnector } from './types';

/**
 * Available configuration options for the feed plugin.
 */
export interface FeedsConfig {}

/**
 * Creates new Pilet API extensions for supporting simplified data feed connections.
 */
export function createFeedsApi(config: FeedsConfig = {}): PiralPlugin<PiletFeedsApi> {
  return (context) => {
    context.defineActions(actions);

    context.dispatch((state) => ({
      ...state,
      feeds: {},
    }));

    return (_, target) => {
      let feeds = 0;

      return {
        createConnector(resolver) {
          const id = buildName(target.name, feeds++);
          const options = createFeedOptions(id, resolver);
          const invalidate = () => {
            options.dispose?.();
            context.createFeed(options.id);
          };

          if (options.immediately) {
            context.loadFeed(options);
          } else {
            invalidate();
          }

          const connect = ((component) => withFeed(component, options) as any) as FeedConnector<any>;

          Object.keys(options.reducers).forEach((type) => {
            const reducer = options.reducers[type];

            if (typeof reducer === 'function') {
              connect[type] = (...args) => {
                context.updateFeed(id, args, (data, item) => reducer.call(connect, data, ...item));
              };
            }
          });

          connect.invalidate = invalidate;
          return connect;
        },
      };
    };
  };
}
