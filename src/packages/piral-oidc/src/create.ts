import { Extend } from 'piral-core';
import { OidcClient } from './setup';
import { PiralOidcApi } from './types';

/**
 * Creates new Pilet API extensions for the integration of OpenID Connect.
 */
export function createOidcApi(client: OidcClient): Extend<PiralOidcApi> {
  return context => {
    context.on('before-fetch', client.extendHeaders);

    return {
      getAccessToken() {
        return client.token();
      },
    };
  };
}
