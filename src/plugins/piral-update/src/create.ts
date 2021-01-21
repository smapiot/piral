import * as actions from './actions';
import { PiralPlugin } from 'piral-core';
import { DefaultUpdateDialog } from './default';
import { checkPeriodically } from './helpers';
import { PiletUpdateApi, ListenCallback } from './types';

export interface UpdateConfig {
  /**
   * Sets the connector for listening to retrieve update notifications.
   * By default a periodic check every 5 minute is used.
   */
  listen?: ListenCallback;
}

/**
 * Creates new Pilet API extensions for updates of pilets.
 */
export function createUpdateApi(config: UpdateConfig = {}): PiralPlugin<PiletUpdateApi> {
  const { listen = checkPeriodically() } = config;

  return (context) => {
    context.defineActions(actions);

    context.dispatch((state) => ({
      ...state,
      components: {
        UpdateDialog: DefaultUpdateDialog,
        ...state.components,
      },
      registry: {
        ...state.registry,
        updatability: {},
      },
      updatability: {
        active: false,
        lastHash: undefined,
        target: [],
      },
    }));

    listen(context.checkForUpdates, context);

    return (_, target) => {
      const pilet = target.name;

      return {
        canUpdate(mode) {
          context.setUpdateMode(pilet, mode);
        },
      };
    };
  };
}
