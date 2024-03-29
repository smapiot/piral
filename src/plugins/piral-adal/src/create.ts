import { PiralPlugin } from 'piral-core';
import { AdalClient } from './setup';
import { PiletAdalApi } from './types';

/**
 * Creates new Pilet API extensions for the integration of MSAL.
 */
export function createAdalApi(client: AdalClient): PiralPlugin<PiletAdalApi> {
  return (context) => {
    context.on('before-fetch', client.extendHeaders);

    return {
      getAccessToken() {
        return client.token();
      },
    };
  };
}
