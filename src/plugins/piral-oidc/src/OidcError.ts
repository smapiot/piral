import { OidcErrorType, PiralOidcError } from './types';

const errorMessageMap = {
  [OidcErrorType.notAuthorized]: 'Not logged in. Please call `login()` to retrieve a token.',
  [OidcErrorType.silentRenewFailed]: 'Silent renew failed to retrieve access token.',
  [OidcErrorType.invalidToken]: 'Invalid token during authentication',
};

const getErrorMessage = (type: OidcErrorType, innerError?: Error | string) => {
  const message = errorMessageMap[type];
  return message || (innerError ? innerError.toString() : 'an unexpected error has occurred without a message');
};

/**
 * A custom error class for oidc errors. It is important to use this class
 * instead of generic Errors, as some application paths inspect `OidcError['type']`.
 *
 * An optional innerError can be supplied in order to not lose visibility on messages provided
 * by oidc-client.
 */
export class OidcError extends Error implements PiralOidcError {
  public readonly type;
  public readonly innerError;

  constructor(errorType: OidcErrorType, innerError?: Error | string) {
    const message = getErrorMessage(errorType, innerError);
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OidcError);
    }

    this.name = 'OidcError';
    this.type = errorType;
    this.innerError = innerError;
  }
}
