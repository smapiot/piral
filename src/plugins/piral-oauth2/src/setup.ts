import * as ClientOAuth2 from 'client-oauth2';
import { createOAuth2MemoryPersistence } from './utils';
import { OAuth2Persistence } from './types';

/**
 * Available configuration options for the OAuth 2 plugin.
 */
export interface OAuth2Config {
  /**
   * The id of the client. Required for the setup of OAuth 2.
   */
  clientId: string;
  /**
   * The client secret. Only required for the `code` flow.
   */
  clientSecret?: string;
  /**
   * The Uri pointing to the authorization endpoint of the Identity Provider.
   */
  authorizationUri: string;
  /**
   * The Uri pointing to the access token endpoint of the Identity Provider.
   */
  accessTokenUri?: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * The return path to use in case of the "code" flow. By default the
   * path will be set to "/".
   */
  returnPath?: string;
  /**
   * The scopes to be used.
   */
  scopes?: Array<string>;
  /**
   * The OAuth 2 authorization flow type to be used.
   */
  flow?: 'implicit' | 'code';
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
  /**
   * Optional persistence layer for OAuth 2. By default nothing is stored.
   */
  persist?: OAuth2Persistence;
}

export interface OAuth2Request {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OAuth2Client {
  /**
   * Performs a login.
   */
  login(): void;
  /**
   * Performs a logout.
   */
  logout(): void;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Checks if the user is currently logged in.
   */
  account(): boolean;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OAuth2Request): void;
}

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
