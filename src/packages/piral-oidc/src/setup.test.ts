import { UserManager } from 'oidc-client';

import { setupOidcClient } from './setup';
import { OidcClient, OidcConfig } from './types';

jest.mock('oidc-client');

describe('Piral-Oidc setup module', () => {
  let oidcConfig: OidcConfig;
  const MockUserManager = UserManager as jest.MockedClass<typeof UserManager>;

  afterAll(() => jest.unmock('oidc-client'));

  beforeEach(() => {
    MockUserManager.mockClear();
    oidcConfig = {
      clientId: 'clientId',
      identityProviderUri: 'http://localhost:8080/provider/uri',
      redirectUri: '/auth',
      postLogoutRedirectUri: '/post-logout',
      scopes: ['openid', 'custom'],
      restrict: false,
    };
  });

  it('setupOidcClient should return the following signature', () => {
    const client = setupOidcClient(oidcConfig);
    expect(client).toMatchObject<OidcClient>({
      login: expect.any(Function),
      logout: expect.any(Function),
      extendHeaders: expect.any(Function),
      token: expect.any(Function),
      account: expect.any(Function),
    });
  });

  it('setupOidcClient should do silent redirect', () => {
    expect(UserManager).not.toHaveBeenCalled();
    const client = setupOidcClient(oidcConfig);
    expect(UserManager).toHaveBeenCalledTimes(1);
    const instance = MockUserManager.mock.instances[0];
    expect(instance.signinRedirectCallback).toHaveBeenCalledTimes(1);
    expect(instance.signinSilentCallback).toHaveBeenCalledTimes(1);
    expect(instance.signoutRedirectCallback).toHaveBeenCalledTimes(1);
  });

  describe('setupOidcClient returned object', () => {
    let client: OidcClient;
    let userManager: UserManager;

    beforeEach(() => {
      jest.clearAllMocks();
      client = setupOidcClient(oidcConfig);
      userManager = MockUserManager.mock.instances[0];
    });

    it('login() should signInRedirect on the UserManager', () => {
      expect(userManager.signinRedirect).not.toHaveBeenCalled();
      client.login();
      expect(userManager.signinRedirect).toHaveBeenCalledTimes(1);
    });

    it('logout() should call signoutRedirect on the UserManager', () => {
      expect(userManager.signoutRedirect).not.toHaveBeenCalled();
      client.logout();
      expect(userManager.signoutRedirect).toHaveBeenCalledTimes(1);
    });

    it('token() should get the token from the user manager', async () => {
      const user: any = {
        access_token: '123',
        expires_in: 100,
      };
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockResolvedValue(user);
      const token = await client.token();
      expect(token).toBe(user.access_token);
    });

    it('token() should signinSilent() with an expired user', async () => {
      const user: any = {
        access_token: '123',
        expires_in: 0,
      };
      const userTwo: any = {
        access_token: '456',
        expires_in: 10000,
      };
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>)
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(userTwo);
      (userManager.signinSilent as jest.MockedFunction<typeof userManager.signinSilent>).mockResolvedValue(null);
      expect(userManager.signinSilent).not.toHaveBeenCalled();
      const token = await client.token();
      expect(token).toBe(userTwo.access_token);
      expect(userManager.signinSilent).toHaveBeenCalledTimes(1);
    });

    it('token() should reject without a user', () => {
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockResolvedValue(null);
      return expect(client.token()).rejects.toMatch('Not logged in.');
    });

    it('token() rejects when UserManager rejects', async () => {
      const e = new Error('test error');
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockRejectedValue(e);
      await expect(client.token()).rejects.toThrow(e);
    });

    it('account() should return the User profile', () => {
      const user: any = {
        access_token: '123',
        expires_in: 100,
        profile: {
          foo: 'bar',
        },
      };
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockResolvedValue(user);
      return expect(client.account()).resolves.toBe(user.profile);
    });

    it('account() should reject when user is expired', () => {
      const user: any = {
        access_token: '123',
        expires_in: 0,
        profile: {
          foo: 'bar',
        },
      };
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockResolvedValue(user);
      return expect(client.account()).rejects.toMatch('Not logged in.');
    });

    it('account() should reject when user is not authenticated', () => {
      (userManager.getUser as jest.MockedFunction<typeof userManager.getUser>).mockResolvedValue(null);
      return expect(client.account()).rejects.toMatch('Not logged in.');
    });
  });
});
