/**
 * Available configuration options for the OAuth 2.0 plugin.
 */
export interface OAuth2Config {
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
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
   * Retrieves the current account.
   */
  account(): Account;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OAuth2Request): void;
}

/**
 * Sets up a new client wrapping the oauth2 API.
 * @param config The configuration for the client.
 */
export function setupOAuth2Client(config: OAuth2Config): OAuth2Client {
  const { restrict = false } = config;
  return {
    login() {
      //TODO
    },
    logout() {
      //TODO
    },
    account() {
      //TODO
      return undefined;
    },
    extendHeaders(req) {
      if (!restrict) {
        //TODO
        req.setHeaders(undefined);
      }
    },
    token() {
      //TODO
      return undefined;
    },
  };
}
