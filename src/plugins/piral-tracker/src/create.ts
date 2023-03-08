import * as actions from './actions';
import { buildName, withApi, PiralPlugin } from 'piral-core';
import { PiletTrackerApi } from './types';

/**
 * Available configuration options for the tracker plugin.
 */
export interface TrackerConfig {}

/**
 * Creates the Pilet API extension for activating tracker support.
 */
export function createTrackerApi(config: TrackerConfig = {}): PiralPlugin<PiletTrackerApi> {
  return (context) => {
    context.defineActions(actions);

    return (api, target) => {
      const pilet = target.name;
      let next = 0;

      return {
        registerTracker(name, arg?) {
          if (typeof name !== 'string') {
            arg = name;
            name = next++;
          }

          const id = buildName(pilet, name);
          context.registerTracker(id, {
            pilet,
            component: withApi(context, arg, api, 'tracker'),
          });
          return () => api.unregisterTracker(name);
        },
        unregisterTracker(name) {
          const id = buildName(pilet, name);
          context.unregisterTracker(id);
        },
      };
    };
  };
}
