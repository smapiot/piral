import { UserManager, Log } from 'oidc-client';

/**
 * Available configuration options for the OpenID Connect plugin.
 */
export interface OidcConfig {
  /**
   * The id of the client. Required for the setup of OAuth 2.0.
   */
  clientId: string;
  /**
   * The client secret.
   */
  clientSecret?: string;
  /**
   * The Uri pointing to the Identity Provider.
   */
  identityProviderUri: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * The Uri to which the Identity provider should redirect
   * after a logout. By default the origin is used.
   */
  postLogoutRedirectUri?: string;
  /**
   * The protocol response type to be used. By default, `id_token`
   * is used.
   */
  responseType?: string;
  /**
   * The scopes to be used. By default, `openid` is used.
   */
  scopes?: Array<string>;
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
}

/**
 * The current OIDC user profile, including, the OICD Standard Claims.
 */
export interface OidcProfile {
  /**
   * Subject - Identifier for the End-User at the Issuer.
   */
  readonly sub?:string;
  /**
   * End-User's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User's locale and preferences.
   */
  readonly name?: string;
  /**
   * Given name(s) or first name(s) of the End-User. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters.
   */
  readonly givenName?: string;
  /**
   * Surname(s) or last name(s) of the End-User. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters.
   */
  readonly familyName?:string;
  /**
   * Middle name(s) of the End-User. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.
   */
  readonly middleName?:string;
  /**
   * Casual name of the End-User that may or may not be the same as the given_name. For instance, a nickname value of Mike might be returned alongside a given_name value of Michael.
   */
  readonly nickname?:string;
  /**
   * Shorthand name by which the End-User wishes to be referred to at the RP, such as janedoe or j.doe. This value MAY be any valid JSON string including special characters such as @, /, or whitespace.
   */
  readonly preferredUsername?:string;
  /**
   * URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User.
   */
  readonly profile?:string;
  /**
   * URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD specifically reference a profile photo of the End-User suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User.
   */
  readonly picture?:string;
  /**
   * URL of the End-User's Web page or blog. This Web page SHOULD contain information published by the End-User or an organization that the End-User is affiliated with.
   */
  readonly website?:string;
  /**
   * End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 addr-spec syntax.
   */
  readonly email?:string;
  /**
   * True if the End-User's e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed. The means by which an e-mail address is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating.
   */
  readonly emailVerified?: boolean;
  /**
   * End-User's gender. Values defined by this specification are female and male. Other values MAY be used when neither of the defined values are applicable.
   */
  readonly gender?:string;
  /**
   * End-User's birthday, represented as an ISO 8601:2004 YYYY-MM-DD format. The year MAY be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed. Note that depending on the underlying platform's date related function, providing just year can result in varying month and day, so the implementers need to take this factor into account to correctly process the dates.
   */
  readonly birthdate?:string;
  /**
   * String from zoneinfo time zone database representing the End-User's time zone. For example, Europe/Paris or America/Los_Angeles.
   */
  readonly zoneinfo?:string;
  /**
   * End-User's locale, represented as a BCP47 language tag. This is typically an ISO 639-1 Alpha-2 language code in lowercase and an ISO 3166-1 Alpha-2 country code in uppercase, separated by a dash. For example, en-US or fr-CA. As a compatibility note, some implementations have used an underscore as the separator rather than a dash, for example, en_US; Relying Parties MAY choose to accept this locale syntax as well.
   */
  readonly locale?:string;
  /**
   * End-User's preferred telephone number. E.164 is RECOMMENDED as the format of this Claim, for example, +1 (425) 555-1212 or +56 (2) 687 2400. If the phone number contains an extension, it is RECOMMENDED that the extension be represented using the RFC 3966 extension syntax, for example, +1 (604) 555-1234;ext=5678.
   */
  readonly phoneNumber?:string;
  /**
   * True if the End-User's phone number has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this phone number was controlled by the End-User at the time the verification was performed. The means by which a phone number is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating. When true, the phone_number Claim MUST be in E.164 format and any extensions MUST be represented in RFC 3966 format
   */
  readonly phoneNumberVerified?: boolean;
  /**
   * Time the End-User's information was last updated. Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z as measured in UTC until the date/time.
   */
  readonly updatedAt?: number;
  /**
   * Claims
   */
  readonly [key: string]: any
}

export interface OidcRequest {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OidcClient {
  /**
   * Performs a login.
   */
  login(): void;
  /**
   * Performs a logout.
   */
  logout(): void;
  /**
   * Retrieves the current user profile.
   */
  profile(): Promise<OidcProfile>;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OidcRequest): void;
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
        user => {
          if (!user) {
            rej('Not logged in. Please call `login()` to retrieve a token.');
          } else if (user.access_token && user.expires_in > 60) {
            res(user.access_token);
          } else {
            userManager.signinSilent().then(() => retrieveToken().then(res, rej), rej);
          }
        },
        err => rej(err),
      );
    });
  };

  const retrieveProfile = () => {
    return new Promise<OidcProfile>((res, rej) => {
      userManager.getUser().then(
        user => {
          if (!user || user.expires_in <= 0) {
            rej('Not logged in. Please call `login()` to retreive the current profile.');
          }
          else {
            res(<OidcProfile> user.profile);
          }
        },
        err => rej(err),
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
            token => token && { Authorization: `Bearer ${token}` },
            () => undefined,
          ),
        );
      }
    },
    token: retrieveToken,
    profile: retrieveProfile
  };
}
