import { buildName, PiletApi, PiletMetadata } from 'piral-core';
import { withFeed } from './withFeed';
import { createFeedOptions } from './utils';
import { PiletFeedsApi } from './types';

export function createFeedsApi(api: PiletApi, target: PiletMetadata): PiletFeedsApi {
  let feeds = 0;
  return {
    createConnector(resolver) {
      const id = buildName(target,name, feeds++);
      const options = createFeedOptions(id, resolver);
      context.createFeed(options.id);

      if (options.immediately) {
        context.loadFeed(options);
      }

      return component => withFeed(component, options) as any;
    },
  }
}
