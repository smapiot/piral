import { createOidcApi } from './create';
import { PiralOidcApi } from './types';

declare module 'piral-oidc/src/types' {
  interface PiralCustomOidcProfile {
    testClaim: string;
  }
}

describe('Piral-Oidc create module', () => {
  let mock: any = null;
  let context: any = null;
  const mockToken = '123-abcd';
  const mockProfile = {
    access_token: mockToken,
    claims: 'custom_claim',
    testClaim: 'foobar',
  };

  beforeEach(() => {
    context = {
      on: jest.fn(),
    };

    mock = {
      token: jest.fn(() => mockToken),
      account: jest.fn(() => mockProfile),
    };
  });

  it('createOidcApi should add a function named getAccessToken', () => {
    expect((createOidcApi(mock)(context) as any).getAccessToken).toEqual(expect.any(Function));
  });

  it('api.getAccessToken() should return the client.token()', () => {
    const api = createOidcApi(mock)(context) as PiralOidcApi;
    expect(api.getAccessToken()).toBe(mockToken);
  });

  it('createOidcApi should add a function named getProfile', () => {
    expect((createOidcApi(mock)(context) as any).getProfile).toEqual(expect.any(Function));
  });

  it('api.getProfile() should return client.account()', async () => {
    const api = createOidcApi(mock)(context) as PiralOidcApi;
    const profile = await api.getProfile();
    expect(profile).toEqual(mockProfile);
    // This is asserting the custom claims works, otherwise we would get a type error
    expect(profile.testClaim).toBe(mockProfile.testClaim);
  });
});
