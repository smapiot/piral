import * as actions from './actions';
import { swap } from '@dbeining/react-atom';
import { buildName, Extend } from 'piral-core';
import { withFeed } from './withFeed';
import { createFeedOptions } from './utils';
import { PiletFeedsApi } from './types';

/**
 * Available configuration options for the feed extension.
 */
export interface FeedsConfig {}

/**
 * Creates a new Piral API extension for supporting simplified data feed connections.
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
          context.createFeed(options.id);

          if (options.immediately) {
            context.loadFeed(options);
          }

          return component => withFeed(component, options) as any;
        },
      };
    };
  };
}
