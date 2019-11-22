import { Extend } from 'piral-core';
import { AdalClient } from './setup';
import { PiralAdalApi } from './types';

/**
 * Creates a new Piral API extension for the integration of MSAL.
 */
export function createAdalApi(client: AdalClient): Extend<PiralAdalApi> {
  return context => {
    context.on('before-fetch', e => {
      e.setHeaders(
        client.token().then(
          token =>
            token && {
              Authorization: `Bearer ${token}`,
            },
          () => undefined,
        ),
      );
    });

    return {
      getAccessToken() {
        return client.token();
      },
    };
  };
}
