import { PiralPlugin } from 'piral-core';
import { setupPwaClient } from './setup';
import { useNotification } from './utils';
import { PiletPwaApi } from './types';

/**
 * Creates new Pilet API extensions for PWA support.
 */
export function createPwaApi(client = setupPwaClient()): PiralPlugin<PiletPwaApi> {
  return () => {
    return {
      showAppNotification(title, options) {
        return client.use((m) => useNotification(m, () => m.showNotification(title, options)));
      },
    };
  };
}
