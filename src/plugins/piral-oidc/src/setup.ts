import { Log, User, UserManager } from 'oidc-client';
import { OidcError } from './OidcError';
import { AuthenticationResult, LogLevel, OidcClient, OidcConfig, OidcErrorType, OidcProfile } from './types';

const logLevelToOidcMap = {
  [LogLevel.none]: 0,
  [LogLevel.error]: 1,
  [LogLevel.warn]: 2,
  [LogLevel.info]: 3,
  [LogLevel.debug]: 4,
};

function doesWindowLocationMatch(targetUri: string) {
  return window.location.pathname === new URL(targetUri).pathname;
}

function convertLogLevelToOidcClient(level: LogLevel) {
  return logLevelToOidcMap[level];
}

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
    signInRedirectParams,
    postLogoutRedirectUri = location.origin,
    responseType,
    scopes,
    restrict = false,
    parentName,
    appUri,
    logLevel,
    userStore
  } = config;

  const isMainWindow = () => (parentName ? parentName === window.parent?.name : window === window.top);

  const userManager = new UserManager({
    authority: identityProviderUri,
    redirect_uri: redirectUri,
    silent_redirect_uri: redirectUri,
    popup_redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    response_type: responseType,
    scope: scopes?.join(' '),
    userStore: userStore
  });

  if (logLevel !== undefined) {
    Log.logger = console;
    Log.level = convertLogLevelToOidcClient(logLevel);
  } else if (process.env.NODE_ENV === 'development') {
    Log.logger = console;
    Log.level = Log.DEBUG;
  }

  if (doesWindowLocationMatch(userManager.settings.post_logout_redirect_uri)) {
    if (isMainWindow()) {
      userManager.signoutRedirectCallback();
    } else {
      userManager.signoutPopupCallback();
    }
  }

  const retrieveToken = () => {
    return new Promise<string>((res, rej) => {
      userManager
        .getUser()
        .then((user) => {
          if (!user) {
            rej(new OidcError(OidcErrorType.notAuthorized));
          } else if (user.access_token && user.expires_in > 60) {
            res(user.access_token);
          } else {
            return userManager.signinSilent().then((user) => {
              if (!user) {
                return rej(new OidcError(OidcErrorType.silentRenewFailed));
              }
              if (!user.access_token) {
                return rej(new OidcError(OidcErrorType.invalidToken));
              }
              return res(user.access_token);
            });
          }
        })
        .catch((err) => rej(new OidcError(OidcErrorType.unknown, err)));
    });
  };

  const retrieveProfile = () => {
    return new Promise<OidcProfile>((res, rej) => {
      userManager.getUser().then(
        (user) => {
          if (!user || user.expires_in <= 0) {
            return rej(new OidcError(OidcErrorType.notAuthorized));
          } else {
            return res(user.profile as OidcProfile);
          }
        },
        (err) => rej(new OidcError(OidcErrorType.unknown, err)),
      );
    });
  };

  const handleAuthentication = (): Promise<AuthenticationResult> =>
    new Promise(async (resolve, reject) => {
      /** The user that is resolved when finishing the callback  */
      let user: User;
      if (
        (doesWindowLocationMatch(userManager.settings.silent_redirect_uri) ||
          doesWindowLocationMatch(userManager.settings.popup_redirect_uri)) &&
        !isMainWindow()
      ) {
        /*
         * This is a silent redirect frame. The correct behavior is to notify the parent of the updated user,
         * and then to do nothing else. Encountering an error here means the background IFrame failed
         * to update the parent. This is usually due to a timeout from a network error.
         */
        try {
          user = await userManager.signinSilentCallback();
        } catch (e) {
          return reject(new OidcError(OidcErrorType.oidcCallback, e));
        }
        return resolve({
            shouldRender: false,
            state: user?.state
        });
      }

      if (doesWindowLocationMatch(userManager.settings.redirect_uri) && isMainWindow()) {
        try {
          user = await userManager.signinCallback();
        } catch (e) {
          /*
           * Failing to handle a sign-in callback is non-recoverable. The user is expected to call `logout()`, after
           * logging this error to their internal error-handling service. Usually, this is due to a misconfigured auth server.
           */
          return reject(new OidcError(OidcErrorType.oidcCallback, e));
        }

        if (appUri) {
          Log.debug(`Redirecting to ${appUri} due to appUri being configured.`);
          window.location.href = appUri;
          return resolve({
            shouldRender: false,
            state: user?.state
          });
        }

        /* If appUri is not configured, we let the user decide what to do after getting a session. */
        return resolve({
          shouldRender: true,
          state: user?.state
        });
      }

      /*
       * The current page is a normal flow, not a callback or signout. We should retrieve the current access_token,
       * or log the user in if there is no current session.
       * This branch of code should also tell the user to render the main application.
       */
      return retrieveToken()
        .then((token) => {
          if (token) {
            return resolve({ shouldRender: true });
          } else {
            /* We should never get into this state, retrieveToken() should reject if there is no token */
            return reject(new OidcError(OidcErrorType.invalidToken));
          }
        })
        .catch(async (reason: OidcError) => {
          if (reason.type === OidcErrorType.notAuthorized) {
            /*
             * Expected Error during normal code flow:
             * This is the first time logging in since a logout (or ever), instead of asking the user
             * to call `login()`, just perform it ourself here.
             *
             * The resolve shouldn't matter, as `signinRedirect` will redirect the browser location
             * to the user's configured redirectUri.
             */
            await userManager.signinRedirect(signInRedirectParams);
            return resolve({ shouldRender: false });
          }

          /*
           * Getting here is a non-recoverable error. It is up to the user to determine what to do.
           * Usually this is a result of failing to reach the authentication server, or a misconfigured
           * authentication server, or a bad clock skew (commonly caused by docker in windows).
           */
          return reject(reason);
        });
    });

  return {
    login() {
      return userManager.signinRedirect(signInRedirectParams);
    },
    logout() {
      return userManager.signoutRedirect();
    },
    handleAuthentication,
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
    account: retrieveProfile
  };
}
