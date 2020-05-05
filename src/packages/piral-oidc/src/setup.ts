import { UserManager, Log } from 'oidc-client';
import { OidcConfig, OidcClient, OidcProfileWithCustomClaims } from './types';

/**
 * Sets up a new client wrapping the oidc-client API.
 * @param config The configuration for the client.
 */
export function setupOidcClient(config: OidcConfig): OidcClient {
  const {
    clientId,
    clientSecret,
    identityProviderUri,
    redirectUri = `${location.origin}/auth`,
    postLogoutRedirectUri = location.origin,
    responseType,
    scopes,
    restrict = false,
  } = config;
  const userManager = new UserManager({
    authority: identityProviderUri,
    redirect_uri: redirectUri,
    silent_redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    response_type: responseType,
    scope: scopes?.join(' '),
  });

  if (process.env.NODE_ENV === 'development') {
    Log.logger = console;
    Log.level = Log.DEBUG;
  }

  userManager.signinRedirectCallback();
  userManager.signinSilentCallback();
  userManager.signoutRedirectCallback();

  const retrieveToken = () => {
    return new Promise<string>((res, rej) => {
      userManager.getUser().then(
        (user) => {
          if (!user) {
            rej('Not logged in. Please call `login()` to retrieve a token.');
          } else if (user.access_token && user.expires_in > 60) {
            res(user.access_token);
          } else {
            userManager.signinSilent().then(() => retrieveToken().then(res, rej), rej);
          }
        },
        (err) => rej(err),
      );
    });
  };

  const retrieveProfile = () => {
    return new Promise<OidcProfileWithCustomClaims>((res, rej) => {
      userManager.getUser().then(
        (user) => {
          if (!user || user.expires_in <= 0) {
            rej('Not logged in. Please call `login()` to retreive the current profile.');
          } else {
            res(user.profile as OidcProfileWithCustomClaims);
          }
        },
        (err) => rej(err),
      );
    });
  };

  return {
    login() {
      userManager.signinRedirect();
    },
    logout() {
      userManager.signoutRedirect();
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
    token: retrieveToken,
    account: retrieveProfile,
  };
}
