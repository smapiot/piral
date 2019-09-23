import * as actions from './actions';
import { buildName, Extend } from 'piral-core';
import { withFeed } from './withFeed';
import { createFeedOptions } from './utils';
import { PiletFeedsApi } from './types';

/**
 * Creates a new Piral API extension for supporting simplified data feed connections.
 */
export function createFeedsApi(): Extend<PiletFeedsApi> {
  return context => {
    context.defineActions(actions);

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
