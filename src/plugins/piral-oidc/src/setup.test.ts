/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest, beforeAll, beforeEach, afterAll } from 'vitest';
import { UserManager } from 'oidc-client-ts';
import { setupOidcClient } from './setup';
import { OidcConfig, OidcErrorType } from './types';

describe('Piral-Oidc setup module', () => {
  const setWindowInIFrame = () =>
    Object.defineProperty(window, 'top', { value: { ...window }, configurable: true, writable: true });
  const setWindowInTop = () =>
    Object.defineProperty(window, 'top', { value: window, configurable: true, writable: true });
  const originalWindowLocation = window.location;
  let oidcConfig: OidcConfig;
  const user = {
    access_token: '123',
    expires_in: 100,
  };
  const mockGetUser = vitest.fn().mockResolvedValue(user).mockName('getUser');
  const mockSigninCallback = vitest.fn().mockResolvedValue(undefined).mockName('signinCallback');
  const mockSigninRedirectCallback = vitest.fn().mockResolvedValue(undefined).mockName('signinRedirectCallback');
  const mockSigninRedirect = vitest.fn().mockResolvedValue(undefined).mockName('signinRedirect');
  const mockSigninSilent = vitest.fn().mockResolvedValue(undefined).mockName('signinSilent');
  const mockSigninSilentCallback = vitest.fn().mockResolvedValue(undefined).mockName('signinSilentCallback');
  const mockSignoutRedirect = vitest.fn().mockResolvedValue(undefined).mockName('signoutRedirect');
  const mockSignoutRedirectCallback = vitest.fn().mockResolvedValue(undefined).mockName('signoutRedirectCallback');
  const mockSignoutPopupCallback = vitest.fn().mockResolvedValue(undefined).mockName('signoutPopupCallback');

  const postLogoutRedirectUri = 'http://localhost:8000/post-logout';
  const redirectUri = 'http://localhost:8000/callback';
  const appUri = 'http://localhost:8000/app';

  beforeAll(() => {
    vitest.spyOn(UserManager.prototype, 'getUser').mockImplementation(mockGetUser);
    vitest.spyOn(UserManager.prototype, 'signinCallback').mockImplementation(mockSigninCallback);
    vitest.spyOn(UserManager.prototype, 'signinRedirectCallback').mockImplementation(mockSigninRedirectCallback);
    vitest.spyOn(UserManager.prototype, 'signinRedirect').mockImplementation(mockSigninRedirect);
    vitest.spyOn(UserManager.prototype, 'signinSilent').mockImplementation(mockSigninSilent);
    vitest.spyOn(UserManager.prototype, 'signinSilentCallback').mockImplementation(mockSigninSilentCallback);
    vitest.spyOn(UserManager.prototype, 'signoutRedirect').mockImplementation(mockSignoutRedirect);
    vitest.spyOn(UserManager.prototype, 'signoutRedirectCallback').mockImplementation(mockSignoutRedirectCallback);
    vitest.spyOn(UserManager.prototype, 'signoutPopupCallback').mockImplementation(mockSignoutPopupCallback);
  });

  afterAll(() => {
    window.location = originalWindowLocation;
    setWindowInTop();
  });

  beforeEach(() => {
    vitest.clearAllMocks();
    mockGetUser.mockResolvedValue(user);
    //@ts-ignore
    delete window.location;
    //@ts-ignore
    window.location = new URL('http://localhost:8000/');
    setWindowInTop();
    oidcConfig = {
      clientId: 'clientId',
      identityProviderUri: 'http://localhost:8080/provider/uri',
      appUri,
      redirectUri,
      postLogoutRedirectUri,
      scopes: ['openid', 'custom'],
      restrict: false,
    };
  });

  it('setupOidcClient should return the following signature', () => {
    const client = setupOidcClient(oidcConfig);
    expect(client).toMatchObject({
      login: expect.any(Function),
      logout: expect.any(Function),
      extendHeaders: expect.any(Function),
      token: expect.any(Function),
      account: expect.any(Function),
      handleAuthentication: expect.any(Function),
    });
  });

  it('should call signoutRedirectCallback when on the post_logout_redirect_uri in the top frame', () => {
    setWindowInTop();
    expect(mockSignoutRedirectCallback).not.toHaveBeenCalled();
    //@ts-ignore
    window.location = new URL(postLogoutRedirectUri);
    setupOidcClient(oidcConfig);
    expect(mockSignoutRedirectCallback).toHaveBeenCalledTimes(1);
    expect(mockSignoutPopupCallback).not.toHaveBeenCalled();
  });

  it('should call signoutPopupCallback and signoutSilentCallback when on the post_logout_redirect_uri in an IFrame', () => {
    setWindowInIFrame();
    expect(mockSignoutPopupCallback).not.toHaveBeenCalled();
    //@ts-ignore
    window.location = new URL(postLogoutRedirectUri);
    const client = setupOidcClient(oidcConfig);
    expect(mockSignoutPopupCallback).toHaveBeenCalledTimes(1);
    expect(mockSignoutRedirectCallback).not.toHaveBeenCalled();
  });

  it('login() should signInRedirect on the UserManager', async () => {
    const client = setupOidcClient(oidcConfig);
    const settings = client._.settings;
    Object.defineProperty(settings, 'popup_redirect_uri', {
      get() {
        return settings.popup_redirect_uri || settings.redirect_uri;
      },
    });
    Object.defineProperty(settings, 'post_logout_redirect_uri', {
      get() {
        return settings.post_logout_redirect_uri;
      },
    });
    Object.defineProperty(settings, 'redirect_uri', {
      get() {
        return settings.redirect_uri;
      },
    });
    Object.defineProperty(settings, 'silent_redirect_uri', {
      get() {
        return settings.silent_redirect_uri || settings.redirect_uri;
      },
    });
    expect(mockSigninRedirect).not.toHaveBeenCalled();
    await client.login();
    expect(mockSigninRedirect).toHaveBeenCalledTimes(1);
  });

  it('logout() should call signoutRedirect on the UserManager', () => {
    const client = setupOidcClient(oidcConfig);
    expect(mockSignoutRedirect).not.toHaveBeenCalled();
    client.logout();
    expect(mockSignoutRedirect).toHaveBeenCalledTimes(1);
  });

  it('token() should get the token from the user manager', async () => {
    const client = setupOidcClient(oidcConfig);
    const token = await client.token();
    expect(token).toBe(user.access_token);
  });

  it('token() should get a new token via signinSilent() with an expired user', async () => {
    const client = setupOidcClient(oidcConfig);
    const user: any = {
      access_token: '123',
      expires_in: 0,
    };
    const userTwo: any = {
      access_token: '456',
      expires_in: 10000,
    };
    mockSigninSilent.mockResolvedValueOnce(userTwo);
    mockGetUser.mockResolvedValueOnce(user);
    const token = await client.token();
    expect(token).toBe(userTwo.access_token);
  });

  it('token() should reject without a user', () => {
    const client = setupOidcClient(oidcConfig);
    mockGetUser.mockResolvedValue(undefined);
    return expect(client.token()).rejects.toHaveProperty('type', OidcErrorType.notAuthorized);
  });

  it('token() rejects when UserManager rejects', async () => {
    const client = setupOidcClient(oidcConfig);
    const e = new Error('test error');
    mockGetUser.mockRejectedValue(e);
    await expect(client.token()).rejects.toHaveProperty('type', OidcErrorType.unknown);
  });

  it('token() should reject when a user does not have an access_token', () => {
    const client = setupOidcClient(oidcConfig);
    mockGetUser.mockResolvedValue({});
    mockSigninSilent.mockResolvedValue({});
    return expect(client.token()).rejects.toHaveProperty('type', OidcErrorType.invalidToken);
  });

  it('account() should return the User profile', () => {
    const client = setupOidcClient(oidcConfig);
    const user: any = {
      access_token: '123',
      expires_in: 100,
      profile: {
        foo: 'bar',
      },
    };
    mockGetUser.mockResolvedValue(user);
    return expect(client.account()).resolves.toBe(user.profile);
  });

  it('account() should reject when user is expired', () => {
    const client = setupOidcClient(oidcConfig);
    const user: any = {
      access_token: '123',
      expires_in: 0,
      profile: {
        foo: 'bar',
      },
    };
    mockGetUser.mockResolvedValue(user);
    return expect(client.account()).rejects.toHaveProperty('type', OidcErrorType.notAuthorized);
  });

  it('account() should reject when user is not authenticated', () => {
    const client = setupOidcClient(oidcConfig);
    mockGetUser.mockResolvedValue(undefined);
    return expect(client.account()).rejects.toHaveProperty('type', OidcErrorType.notAuthorized);
  });

  it('handleAuthentication() calls signinSilentCallback when on the silent_redirect_uri path in an IFrame', async () => {
    const client = setupOidcClient(oidcConfig);
    setWindowInIFrame();
    //@ts-ignore
    window.location = new URL(redirectUri);
    expect(mockSigninSilentCallback).toBeCalledTimes(0);
    const { shouldRender } = await client.handleAuthentication();
    expect(mockSigninSilentCallback).toBeCalledTimes(1);
    expect(mockSigninCallback).toBeCalledTimes(0);
    expect(shouldRender).toBe(false);
  });

  it('handleAuthentication() calls signinCallback when on the redirect_uri path in the main viewport', async () => {
    const client = setupOidcClient(oidcConfig);
    setWindowInTop();
    //@ts-ignore
    window.location = new URL(redirectUri);
    expect(mockSigninCallback).toBeCalledTimes(0);
    const { shouldRender } = await client.handleAuthentication();
    expect(mockSigninSilentCallback).toBeCalledTimes(0);
    expect(mockSigninCallback).toBeCalledTimes(1);
    expect(shouldRender).toBe(false);
  });

  it('handleAuthentication() redirects to appUri when on the redirect_uri path in the main viewport and appUri is configured', async () => {
    const client = setupOidcClient(oidcConfig);
    setWindowInTop();
    const url = new URL(redirectUri);
    //@ts-ignore
    window.location = url;
    expect(window.location.href).not.toBe(appUri);
    await client.handleAuthentication();
    expect(window.location.href).toBe(appUri);
  });

  it('handleAuthentication() does not redirect to appUri when appUri is not configured', async () => {
    const client = setupOidcClient(oidcConfig);
    const secondClient = setupOidcClient({
      ...oidcConfig,
      appUri: undefined,
    });

    setWindowInTop();
    const url = new URL(redirectUri);
    //@ts-ignore
    window.location = url;
    expect(window.location.href).not.toBe(appUri);
    const { shouldRender } = await secondClient.handleAuthentication();
    expect(window.location.href).not.toBe(appUri);
    expect(shouldRender).toBe(true);
  });

  it('handleAuthentication() returns true when the user has an acess token on normal routes', async () => {
    const client = setupOidcClient(oidcConfig);
    const url = new URL(appUri);
    //@ts-ignore
    window.location = url;
    const { shouldRender } = await client.handleAuthentication();
    expect(shouldRender).toBe(true);
  });

  it('handleAuthentication() redirects to login when the user does not have an access token', async () => {
    const client = setupOidcClient(oidcConfig);
    const url = new URL(appUri);
    mockGetUser.mockResolvedValue(undefined);
    //@ts-ignore
    window.location = url;
    expect(mockSigninRedirect).toBeCalledTimes(0);
    const { shouldRender } = await client.handleAuthentication();
    expect(mockSigninRedirect).toBeCalledTimes(1);
    expect(shouldRender).toBe(false);
  });

  it('handleAuthentication() rejects when token() rejects', async () => {
    const client = setupOidcClient(oidcConfig);
    const e = new Error('test error');
    mockGetUser.mockRejectedValue(e);
    await expect(client.handleAuthentication()).rejects.toHaveProperty('type', OidcErrorType.unknown);
  });

  it('extendHeaders() calls request.setHeaders with the authorization header when the user has a token', async () => {
    const client = setupOidcClient(oidcConfig);
    mockGetUser.mockResolvedValue(user);
    const expected = { Authorization: `Bearer ${user.access_token}` };
    const mockSetHeaders = vitest.fn().mockResolvedValue(undefined);
    const req = {
      setHeaders: mockSetHeaders,
    };
    expect(mockSetHeaders).not.toHaveBeenCalled();
    await client.extendHeaders(req);
    expect(mockSetHeaders).toBeCalledTimes(1);
    const retrieveTokenPromise = mockSetHeaders.mock.calls[0][0];
    expect(await retrieveTokenPromise).toEqual(expected);
  });

  it('extendHeaders() is a noop when `restrict` is true in configuration', async () => {
    const client = setupOidcClient(oidcConfig);
    const mockSetHeaders = vitest.fn().mockResolvedValue(undefined);
    const req = {
      setHeaders: mockSetHeaders,
    };
    const client2 = setupOidcClient({
      ...oidcConfig,
      restrict: true,
    });
    await client2.extendHeaders(req);
    expect(mockSetHeaders).not.toBeCalled();
  });

  it('extendHeaders() does nothing when the user has no token', async () => {
    const client = setupOidcClient(oidcConfig);
    mockGetUser.mockResolvedValue(undefined);
    const mockSetHeaders = vitest.fn().mockResolvedValue(undefined);
    const req = {
      setHeaders: mockSetHeaders,
    };
    expect(mockSetHeaders).not.toHaveBeenCalled();
    await client.extendHeaders(req);
    expect(mockSetHeaders).toBeCalledTimes(1);
    const retrieveTokenPromise = mockSetHeaders.mock.calls[0][0];
    expect(await retrieveTokenPromise).toEqual(undefined);
  });
});
