import { Extend } from 'piral-core';
import { setupPwaClient } from './setup';
import { PiletPwaApi } from './types';

/**
 * Creates a new set of Piral API extensions for PWA support.
 */
export function createPwaApi(client = setupPwaClient()): Extend<PiletPwaApi> {
  return () => {
    return {
      showAppNotification(title, options) {
        return client.use(m => m && m.showNotification(title, options));
      },
    };
  };
}
