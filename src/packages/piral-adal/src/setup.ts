import { UserAgentApplication, Account, AuthenticationParameters } from 'msal';

function retrieveToken(msalInstance: UserAgentApplication, auth: AuthenticationParameters) {
  if (msalInstance.getAccount()) {
    return msalInstance
      .acquireTokenSilent(auth)
      .then(response => response.accessToken)
      .catch(err => {
        if (err.name === 'InteractionRequiredAuthError') {
          return msalInstance
            .acquireTokenPopup(auth)
            .then(response => response.accessToken)
            .catch(err => Promise.reject(err && err.message));
        }

        console.error(err);
        return Promise.reject('Could not fetch token');
      });
  }

  return Promise.reject('Not logged in');
}

/**
 * Available configuration options for the ADAL extension.
 */
export interface AdalConfig {
  /**
   * The id of the client. Required for the setup of MSAL.
   */
  clientId: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
}

export interface AdalRequest {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface AdalClient {
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
  extendHeaders(req: AdalRequest): void;
}

/**
 * Sets up a new client wrapping the MSAL API.
 * @param config The configuration for the client.
 */
export function setupAdalClient(config: AdalConfig): AdalClient {
  const { clientId, redirectUri = `${location.origin}/auth`, restrict = false } = config;
  const msalInstance = new UserAgentApplication({
    auth: {
      clientId,
      redirectUri,
    },
  });
  const tokenRequest = {
    scopes: [`api://${clientId}/Profile.Read`],
  };
  msalInstance.handleRedirectCallback(() => {});
  return {
    login() {
      msalInstance.loginRedirect(tokenRequest);
    },
    logout() {
      msalInstance.logout();
    },
    account() {
      return msalInstance.getAccount();
    },
    extendHeaders(req) {
      if (!restrict) {
        req.setHeaders(
          retrieveToken(msalInstance, tokenRequest).then(
            token =>
              token && {
                Authorization: `Bearer ${token}`,
              },
            () => undefined,
          ),
        );
      }
    },
    token() {
      return retrieveToken(msalInstance, tokenRequest);
    },
  };
}
