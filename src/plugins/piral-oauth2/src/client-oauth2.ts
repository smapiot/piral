const DEFAULT_URL_BASE = location.origin;

function defaultRequest(method: string, url: string, body: string, headers: Record<string, string>) {
  return fetch(url, {
    body: body,
    method: method,
    headers: headers,
  }).then((res) =>
    res.text().then((body) => ({
      status: res.status,
      body: body,
    })),
  );
}

/**
 * Default headers for executing OAuth 2.0 flows.
 */
const DEFAULT_HEADERS = {
  Accept: 'application/json, application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded',
};

/**
 * Format error response types to regular strings for displaying to clients.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
var ERROR_RESPONSES = {
  invalid_request: [
    'The request is missing a required parameter, includes an',
    'invalid parameter value, includes a parameter more than',
    'once, or is otherwise malformed.',
  ].join(' '),
  invalid_client: [
    'Client authentication failed (e.g., unknown client, no',
    'client authentication included, or unsupported',
    'authentication method).',
  ].join(' '),
  invalid_grant: [
    'The provided authorization grant (e.g., authorization',
    'code, resource owner credentials) or refresh token is',
    'invalid, expired, revoked, does not match the redirection',
    'URI used in the authorization request, or was issued to',
    'another client.',
  ].join(' '),
  unauthorized_client: ['The client is not authorized to request an authorization', 'code using this method.'].join(
    ' ',
  ),
  unsupported_grant_type: ['The authorization grant type is not supported by the', 'authorization server.'].join(' '),
  access_denied: ['The resource owner or authorization server denied the request.'].join(' '),
  unsupported_response_type: [
    'The authorization server does not support obtaining',
    'an authorization code using this method.',
  ].join(' '),
  invalid_scope: ['The requested scope is invalid, unknown, or malformed.'].join(' '),
  server_error: [
    'The authorization server encountered an unexpected',
    'condition that prevented it from fulfilling the request.',
    '(This error code is needed because a 500 Internal Server',
    'Error HTTP status code cannot be returned to the client',
    'via an HTTP redirect.)',
  ].join(' '),
  temporarily_unavailable: [
    'The authorization server is currently unable to handle',
    'the request due to a temporary overloading or maintenance',
    'of the server.',
  ].join(' '),
};

/**
 * Check if properties exist on an object and throw when they aren't.
 */
function expects(obj: any, ...args: Array<string>) {
  for (let i = 0; i < args.length; i++) {
    var prop = args[i];

    if (obj[prop] == null) {
      throw new TypeError('Expected "' + prop + '" to exist');
    }
  }
}

/**
 * Pull an authentication error from the response data.
 */
function getAuthError(body: any) {
  var message = ERROR_RESPONSES[body.error] || body.error_description || body.error;

  if (message) {
    const err: any = new Error(message);
    err.body = body;
    err.code = 'EAUTH';
    return err;
  }
}

function parseQuerystring(str: string) {
  const q = new URLSearchParams(str);
  return Object.fromEntries(q.entries());
}

function stringifyQuerystring(obj: Record<string, string>) {
  const q = new URLSearchParams(obj);
  return q.toString();
}

/**
 * Attempt to parse response body as JSON, fall back to parsing as a query string.
 *
 * @param {string} body
 * @return {Object}
 */
function parseResponseBody(body: string) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return parseQuerystring(body);
  }
}

/**
 * Sanitize the scopes option to be a string.
 */
function sanitizeScope(scopes: Array<string>) {
  return Array.isArray(scopes) ? scopes.join(' ') : toString(scopes);
}

/**
 * Create a request uri based on an options object and token type.
 */
function createUri(options?: any, tokenType?: string) {
  // Check the required parameters are set.
  expects(options, 'clientId', 'authorizationUri');

  const qs: Record<string, string> = {
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: tokenType,
    state: options.state,
  };

  if (options.scopes !== undefined) {
    qs.scope = sanitizeScope(options.scopes);
  }

  const sep = options.authorizationUri.includes('?') ? '&' : '?';
  return options.authorizationUri + sep + stringifyQuerystring(Object.assign(qs, options.query));
}

/**
 * Create basic auth header.
 */
function auth(username: string, password: string) {
  return 'Basic ' + btoa(toString(username) + ':' + toString(password));
}

/**
 * Ensure a value is a string.
 */
function toString(str: string) {
  return str == null ? '' : String(str);
}

/**
 * Merge request options from an options object.
 */
function requestOptions(
  requestOptions: {
    url: string;
    method: string;
    body?: Record<string, string>;
    query?: Record<string, string>;
    headers?: Record<string, string>;
  },
  options: { body: Record<string, string>; query: Record<string, string>; headers: Record<string, string> },
) {
  return {
    url: requestOptions.url,
    method: requestOptions.method,
    body: Object.assign({}, requestOptions.body, options.body),
    query: Object.assign({}, requestOptions.query, options.query),
    headers: Object.assign({}, requestOptions.headers, options.headers),
  };
}

/**
 * Construct an object that can handle the multiple OAuth 2.0 flows.
 *
 * @param {Object} options
 */
export class ClientOAuth2 {
  code: CodeFlow;
  token: TokenFlow;
  owner: OwnerFlow;
  credentials: CredentialsFlow;
  jwt: JwtBearerFlow;

  constructor(public options: any, private request = defaultRequest) {
    this.code = new CodeFlow(this);
    this.token = new TokenFlow(this);
    this.owner = new OwnerFlow(this);
    this.credentials = new CredentialsFlow(this);
    this.jwt = new JwtBearerFlow(this);
  }

  /**
   * Create a new token from existing data.
   */
  createToken(access: string, refresh: string, type: string, data?: any) {
    var options = Object.assign(
      {},
      data,
      typeof access === 'string' ? { access_token: access } : access,
      typeof refresh === 'string' ? { refresh_token: refresh } : refresh,
      typeof type === 'string' ? { token_type: type } : type,
    );

    return new ClientOAuth2Token(this, options);
  }

  /**
   * Using the built-in request method, we'll automatically attempt to parse
   * the response.
   */
  _request(options: {
    url: string;
    body: Record<string, string>;
    query: Record<string, string>;
    method: string;
    headers: Record<string, string>;
  }) {
    let url = options.url;
    const body = stringifyQuerystring(options.body);
    const query = stringifyQuerystring(options.query);

    if (query) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + query;
    }

    return this.request(options.method, url, body, options.headers).then((res) => {
      const body = parseResponseBody(res.body);
      const authErr = getAuthError(body);

      if (authErr) {
        return Promise.reject(authErr);
      }

      if (res.status < 200 || res.status >= 399) {
        const statusErr: any = new Error('HTTP status ' + res.status);
        statusErr.status = res.status;
        statusErr.body = res.body;
        statusErr.code = 'ESTATUS';
        return Promise.reject(statusErr);
      }

      return body;
    });
  }
}

/**
 * General purpose client token generator.
 *
 * @param {Object} client
 * @param {Object} data
 */
export class ClientOAuth2Token {
  client: ClientOAuth2;
  data: any;
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expires: Date;

  constructor(client: ClientOAuth2, data: any) {
    this.client = client;
    this.data = data;
    this.tokenType = data.token_type && data.token_type.toLowerCase();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;

    this.expiresIn(Number(data.expires_in));
  }

  /**
   * Expire the token after some time.
   */
  expiresIn(duration: number | Date) {
    if (typeof duration === 'number') {
      this.expires = new Date();
      this.expires.setSeconds(this.expires.getSeconds() + duration);
    } else if (duration instanceof Date) {
      this.expires = new Date(duration.getTime());
    } else {
      throw new TypeError('Unknown duration: ' + duration);
    }

    return this.expires;
  }

  /**
   * Sign a standardised request object with user authentication information.
   */
  sign(requestObject: any) {
    if (!this.accessToken) {
      throw new Error('Unable to sign without access token');
    }

    requestObject.headers = requestObject.headers || {};

    if (this.tokenType === 'bearer') {
      requestObject.headers.Authorization = 'Bearer ' + this.accessToken;
    } else {
      var parts = requestObject.url.split('#');
      var token = 'access_token=' + this.accessToken;
      var url = parts[0].replace(/[?&]access_token=[^&#]/, '');
      var fragment = parts[1] ? '#' + parts[1] : '';

      // Prepend the correct query string parameter to the url.
      requestObject.url = url + (url.indexOf('?') > -1 ? '&' : '?') + token + fragment;

      // Attempt to avoid storing the url in proxies, since the access token
      // is exposed in the query parameters.
      requestObject.headers.Pragma = 'no-store';
      requestObject.headers['Cache-Control'] = 'no-store';
    }

    return requestObject;
  }

  /**
   * Refresh a user access token with the supplied token.
   */
  refresh(opts?: any) {
    var self = this;
    var options = Object.assign({}, this.client.options, opts);

    if (!this.refreshToken) {
      return Promise.reject(new Error('No refresh token'));
    }

    return this.client
      ._request(
        requestOptions(
          {
            url: options.accessTokenUri,
            method: 'POST',
            headers: Object.assign({}, DEFAULT_HEADERS, {
              Authorization: auth(options.clientId, options.clientSecret),
            }),
            body: {
              refresh_token: this.refreshToken,
              grant_type: 'refresh_token',
            },
          },
          options,
        ),
      )
      .then((data) => {
        return self.client.createToken(undefined, undefined, undefined, Object.assign({}, self.data, data));
      });
  }

  /**
   * Check whether the token has expired.
   */
  expired() {
    return Date.now() > this.expires.getTime();
  }
}

/**
 * Support resource owner password credentials OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.3
 */
class OwnerFlow {
  client: ClientOAuth2;

  constructor(client: ClientOAuth2) {
    this.client = client;
  }

  /**
   * Make a request on behalf of the user credentials to get an access token.
   */
  getToken(username: string, password: string, opts?: any) {
    var self = this;
    var options = Object.assign({}, this.client.options, opts);

    const body: Record<string, string> = {
      username: username,
      password: password,
      grant_type: 'password',
    };

    if (options.scopes !== undefined) {
      body.scope = sanitizeScope(options.scopes);
    }

    return this.client
      ._request(
        requestOptions(
          {
            url: options.accessTokenUri,
            method: 'POST',
            headers: Object.assign({}, DEFAULT_HEADERS, {
              Authorization: auth(options.clientId, options.clientSecret),
            }),
            body: body,
          },
          options,
        ),
      )
      .then((data) => {
        return self.client.createToken(undefined, undefined, undefined, data);
      });
  }
}

/**
 * Support implicit OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.2
 */
class TokenFlow {
  client: ClientOAuth2;

  constructor(client: ClientOAuth2) {
    this.client = client;
  }

  /**
   * Get the uri to redirect the user to for implicit authentication.
   */
  getUri(opts?: any) {
    var options = Object.assign({}, this.client.options, opts);

    return createUri(options, 'token');
  }

  /**
   * Get the user access token from the uri.
   */
  getToken(uri: string, opts?: any) {
    var options = Object.assign({}, this.client.options, opts);
    var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE);
    var expectedUrl = new URL(options.redirectUri, DEFAULT_URL_BASE);

    if (typeof url.pathname === 'string' && url.pathname !== expectedUrl.pathname) {
      return Promise.reject(new TypeError('Redirected path should match configured path, but got: ' + url.pathname));
    }

    // If no query string or fragment exists, we won't be able to parse
    // any useful information from the uri.
    if (!url.hash && !url.search) {
      return Promise.reject(new TypeError('Unable to process uri: ' + uri));
    }

    // Extract data from both the fragment and query string. The fragment is most
    // important, but the query string is also used because some OAuth 2.0
    // implementations (Instagram) have a bug where state is passed via query.
    var data = Object.assign(
      {},
      typeof url.search === 'string' ? parseQuerystring(url.search.substr(1)) : url.search || {},
      typeof url.hash === 'string' ? parseQuerystring(url.hash.substr(1)) : url.hash || {},
    );

    var err = getAuthError(data);

    // Check if the query string was populated with a known error.
    if (err) {
      return Promise.reject(err);
    }

    // Check whether the state matches.
    if (options.state != null && data.state !== options.state) {
      return Promise.reject(new TypeError('Invalid state: ' + data.state));
    }

    // Initalize a new token and return.
    return Promise.resolve(this.client.createToken(undefined, undefined, undefined, data));
  }
}

/**
 * Support client credentials OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.4
 */
class CredentialsFlow {
  client: ClientOAuth2;

  constructor(client: ClientOAuth2) {
    this.client = client;
  }

  /**
   * Request an access token using the client credentials.
   */
  getToken(opts?: any) {
    var self = this;
    var options = Object.assign({}, this.client.options, opts);

    expects(options, 'clientId', 'clientSecret', 'accessTokenUri');

    const body: Record<string, string> = {
      grant_type: 'client_credentials',
    };

    if (options.scopes !== undefined) {
      body.scope = sanitizeScope(options.scopes);
    }

    return this.client
      ._request(
        requestOptions(
          {
            url: options.accessTokenUri,
            method: 'POST',
            headers: Object.assign({}, DEFAULT_HEADERS, {
              Authorization: auth(options.clientId, options.clientSecret),
            }),
            body: body,
          },
          options,
        ),
      )
      .then((data) => {
        return self.client.createToken(undefined, undefined, undefined, data);
      });
  }
}

/**
 * Support authorization code OAuth 2.0 grant.
 *
 * Reference: http://tools.ietf.org/html/rfc6749#section-4.1
 */
class CodeFlow {
  client: ClientOAuth2;

  constructor(client: ClientOAuth2) {
    this.client = client;
  }

  /**
   * Generate the uri for doing the first redirect.
   */
  getUri(opts?: any) {
    var options = Object.assign({}, this.client.options, opts);

    return createUri(options, 'code');
  }

  /**
   * Get the code token from the redirected uri and make another request for
   * the user access token.
   */
  getToken(uri: string, opts?: any) {
    var self = this;
    var options = Object.assign({}, this.client.options, opts);

    expects(options, 'clientId', 'accessTokenUri');

    var url = typeof uri === 'object' ? uri : new URL(uri, DEFAULT_URL_BASE);

    if (
      typeof options.redirectUri === 'string' &&
      typeof url.pathname === 'string' &&
      url.pathname !== new URL(options.redirectUri, DEFAULT_URL_BASE).pathname
    ) {
      return Promise.reject(new TypeError('Redirected path should match configured path, but got: ' + url.pathname));
    }

    if (!url.search || !url.search.substr(1)) {
      return Promise.reject(new TypeError('Unable to process uri: ' + uri));
    }

    var data = typeof url.search === 'string' ? parseQuerystring(url.search.substr(1)) : url.search || {};
    var err = getAuthError(data);

    if (err) {
      return Promise.reject(err);
    }

    if (options.state != null && data.state !== options.state) {
      return Promise.reject(new TypeError('Invalid state: ' + data.state));
    }

    // Check whether the response code is set.
    if (!data.code) {
      return Promise.reject(new TypeError('Missing code, unable to request token'));
    }

    const headers: Record<string, string> = Object.assign({}, DEFAULT_HEADERS);
    const body: Record<string, string> = {
      code: data.code,
      grant_type: 'authorization_code',
      redirect_uri: options.redirectUri,
    };

    // `client_id`: REQUIRED, if the client is not authenticating with the
    // authorization server as described in Section 3.2.1.
    // Reference: https://tools.ietf.org/html/rfc6749#section-3.2.1
    if (options.clientSecret) {
      headers.Authorization = auth(options.clientId, options.clientSecret);
    } else {
      body.client_id = options.clientId;
    }

    return this.client
      ._request(
        requestOptions(
          {
            url: options.accessTokenUri,
            method: 'POST',
            headers: headers,
            body: body,
          },
          options,
        ),
      )
      .then((data) => {
        return self.client.createToken(undefined, undefined, undefined, data);
      });
  }
}

/**
 * Support JSON Web Token (JWT) Bearer Token OAuth 2.0 grant.
 *
 * Reference: https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-12#section-2.1
 */
class JwtBearerFlow {
  client: ClientOAuth2;

  constructor(client: ClientOAuth2) {
    this.client = client;
  }

  /**
   * Request an access token using a JWT token.
   */
  getToken(token: string, opts?: any) {
    const self = this;
    const options = Object.assign({}, this.client.options, opts);
    const headers: Record<string, string> = Object.assign({}, DEFAULT_HEADERS);

    expects(options, 'accessTokenUri');

    // Authentication of the client is optional, as described in
    // Section 3.2.1 of OAuth 2.0 [RFC6749]
    if (options.clientId) {
      headers.Authorization = auth(options.clientId, options.clientSecret);
    }

    const body: Record<string, string> = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    };

    if (options.scopes !== undefined) {
      body.scope = sanitizeScope(options.scopes);
    }

    return this.client
      ._request(
        requestOptions(
          {
            url: options.accessTokenUri,
            method: 'POST',
            headers: headers,
            body: body,
          },
          options,
        ),
      )
      .then((data) => {
        return self.client.createToken(undefined, undefined, undefined, data);
      });
  }
}
