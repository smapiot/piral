import { PiralPlugin } from 'piral-core';
import { PiletOidcApi, OidcClient } from './types';

/**
 * Creates new Pilet API extensions for the integration of OpenID Connect.
 */
export function createOidcApi(client: OidcClient): PiralPlugin<PiletOidcApi> {
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
