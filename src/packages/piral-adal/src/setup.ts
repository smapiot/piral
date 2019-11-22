import { UserAgentApplication, Account } from 'msal';

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
}

export function setupAdalClient(config: AdalConfig): AdalClient {
  const { clientId, redirectUri = `${location.origin}/auth` } = config;
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
    token() {
      if (msalInstance.getAccount()) {
        return msalInstance
          .acquireTokenSilent(tokenRequest)
          .then(response => response.accessToken)
          .catch(err => {
            if (err.name === 'InteractionRequiredAuthError') {
              return msalInstance
                .acquireTokenPopup(tokenRequest)
                .then(response => response.accessToken)
                .catch(err => Promise.reject(err && err.message));
            }

            console.error(err);
            return Promise.reject('Could not fetch token');
          });
      }

      return Promise.reject('Not logged in');
    },
  };
}
