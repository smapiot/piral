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
 * Available configuration options for the ADAL plugin.
 */
export interface AdalConfig {
  /**
   * The id of the client. Required for the setup of MSAL.
   */
  clientId: string;
  /**
   * The isser of the token. Should be an URL containing the tenant.
   * By default set to Microsoft's default tenant.
   */
  authority?: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * The scopes to be used. By default uses only the 'User.Read' scope.
   */
  scopes?: Array<string>;
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
  /**
   * Determines the cache location.
   */
  cacheLocation?: 'localStorage' | 'sessionStorage';
  /**
   * If true MSAL will store the auth request state required for validation
   * of the auth flows in the browser cookies.
   * @default false
   */
  storeAuthStateInCookie?: boolean;
  /**
   * Determines the system specific options. Usually not needed.
   * For more details see the MSAL.js documentation.
   */
  system?: any;
  /**
   * Determines the framework specific options. Usually not needed.
   * For more details see the MSAL.js documentation.
   */
  framework?: any;
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
  const {
    clientId,
    authority,
    redirectUri = `${location.origin}/auth`,
    restrict = false,
    scopes = ['User.Read'],
    storeAuthStateInCookie,
    cacheLocation = 'sessionStorage',
    framework,
    system,
  } = config;
  const msalInstance = new UserAgentApplication({
    auth: {
      clientId,
      redirectUri,
      authority,
    },
    cache: {
      storeAuthStateInCookie,
      cacheLocation,
    },
    system,
    framework,
  });
  const tokenRequest = { scopes };
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
