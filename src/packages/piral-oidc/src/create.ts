import { Extend } from 'piral-core';
import { PiralOidcApi, OidcClient } from './types';

/**
 * Creates new Pilet API extensions for the integration of OpenID Connect.
 */
export function createOidcApi(client: OidcClient): Extend<PiralOidcApi> {
  return (context) => {
    context.on('before-fetch', client.extendHeaders);

    return {
      getAccessToken() {
        return client.token();
      },

      getProfile() {
        return client.account();
      },
    };
  };
}
