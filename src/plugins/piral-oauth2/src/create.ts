import { PiralPlugin } from 'piral-core';
import { OAuth2Client, PiralOAuth2Api } from './types';

/**
 * Creates new Pilet API extensions for the integration of OAuth 2.0.
 */
export function createOAuth2Api(client: OAuth2Client): PiralPlugin<PiralOAuth2Api> {
  return (context) => {
    context.on('before-fetch', client.extendHeaders);

    return {
      getAccessToken() {
        return client.token();
      },
    };
  };
}
