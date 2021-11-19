import * as ClientOAuth2 from 'client-oauth2';
import { createOAuth2MemoryPersistence } from './utils';
import { OAuth2Config, OAuth2Client } from './types';

const callbackName = 'oauth2Cb';

/**
 * Sets up a new client wrapping the OAuth 2.0 API.
 * @param config The configuration for the client.
 */
export function setupOAuth2Client(config: OAuth2Config): OAuth2Client {
  const {
    clientId,
    clientSecret,
    authorizationUri,
    accessTokenUri,
    redirectUri = `${location.origin}/auth`,
    scopes = [],
    flow,
    headers,
    query,
    state,
    restrict = false,
    returnPath = '/',
    persist = createOAuth2MemoryPersistence(),
  } = config;

  const client = new ClientOAuth2({
    clientId,
    clientSecret,
    redirectUri,
    authorizationUri,
    accessTokenUri,
    scopes,
    headers,
    query,
    state,
  });

  let currentToken: ClientOAuth2.Token;
  let retrieveToken: () => Promise<string>;
  let getLoginUri: () => string;

  const setCurrentToken = (token: ClientOAuth2.Token) => {
    persist.save({
      accessToken: token.accessToken,
      data: token.data,
      refreshToken: token.refreshToken,
    });

    currentToken = token;
  };

  const retrieve = (init: Promise<void>, refresh: () => Promise<ClientOAuth2.Token>) => {
    return init.then(() => {
      if (!currentToken) {
        return Promise.reject('Not logged in. Please call `login()` to retrieve a token.');
      }

      if (!currentToken.expired()) {
        return currentToken.accessToken;
      }

      return refresh().then((refreshedToken) => {
        setCurrentToken(refreshedToken);
        return currentToken.accessToken;
      });
    });
  };

  const initialize = (load: () => Promise<ClientOAuth2.Token>) => {
    const info = persist.load();

    if (info) {
      currentToken = client.createToken(info.accessToken, info.refreshToken, info.data);
      return Promise.resolve();
    } else {
      return load().then(
        (token) => {
          const opener = window.opener;

          setCurrentToken(token);

          if (opener && typeof opener[callbackName] === 'function') {
            opener[callbackName](token);
            window.close();
          }
        },
        () => {},
      );
    }
  };

  if (flow === 'code') {
    const init = initialize(() => {
      const url = location.href;
      history.replaceState(undefined, undefined, returnPath);
      return client.code.getToken(url);
    });

    retrieveToken = () => {
      return retrieve(init, () => currentToken.refresh());
    };
    getLoginUri = () => client.code.getUri();
  } else {
    const init = initialize(() => client.token.getToken(location.href));

    retrieveToken = () => {
      return retrieve(
        init,
        () =>
          new Promise<ClientOAuth2.Token>((resolve) => {
            window[callbackName] = resolve;
            window.open(client.token.getUri());
          }),
      );
    };
    getLoginUri = () => client.token.getUri();
  }

  return {
    _: client,
    login() {
      window.location.href = getLoginUri();
    },
    logout() {
      currentToken = undefined;
    },
    extendHeaders(req) {
      if (!restrict) {
        req.setHeaders(
          retrieveToken().then(
            (token) => token && { Authorization: `Bearer ${token}` },
            () => undefined,
          ),
        );
      }
    },
    account() {
      return !!currentToken;
    },
    token: retrieveToken,
  };
}
