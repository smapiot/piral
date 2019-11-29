import { Extend } from 'piral-core';
import { setupPwaClient } from './setup';
import { useNotification } from './utils';
import { PiletPwaApi } from './types';

/**
 * Creates a new set of Piral API extensions for PWA support.
 */
export function createPwaApi(client = setupPwaClient()): Extend<PiletPwaApi> {
  return () => {
    return {
      showAppNotification(title, options) {
        return client.use(m => useNotification(m, () => m.showNotification(title, options)));
      },
    };
  };
}
