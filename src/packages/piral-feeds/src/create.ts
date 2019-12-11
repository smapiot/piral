import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { buildName, Extend } from 'piral-core';
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
export function createFeedsApi(config: FeedsConfig = {}): Extend<PiletFeedsApi> {
  return context => {
    context.defineActions(actions);

    swap(context.state, state => ({
      ...state,
      feeds: {},
    }));

    return (_, target) => {
      let feeds = 0;

      return {
        createConnector(resolver) {
          const id = buildName(target.name, feeds++);
          const options = createFeedOptions(id, resolver);
          const invalidate = () => context.createFeed(options.id);

          if (options.immediately) {
            context.loadFeed(options);
          } else {
            invalidate();
          }

          const connect = (component => withFeed(component, options) as any) as FeedConnector<any>;
          connect.invalidate = invalidate;
          return connect;
        },
      };
    };
  };
}
