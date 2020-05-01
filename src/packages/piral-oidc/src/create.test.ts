import { createOidcApi } from './create';

describe('Piral-Oidc create module', () => {
  let mock: any = null;
  let context: any = null;

  beforeEach(() => {
    context = {
      on: jest.fn(),
    };

    mock = {
      client: {
        token: jest.fn(),
        profile: jest.fn(),
      },
    };
  });

  it('createOidcApi should add a function named getAccessToken', () => {
    expect((createOidcApi(mock)(context) as any).getAccessToken).toEqual(expect.any(Function));
  });

  it('createOidcApi should add a function named getProfile', () => {
    expect((createOidcApi(mock)(context) as any).getProfile).toEqual(expect.any(Function));
  })
});
