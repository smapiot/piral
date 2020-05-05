import { setupGqlClient } from './setup';

describe('Piral-Urql setup module', () => {
  it('sets up a new Urql GraphQL client with the origin URL', () => {
    const client = setupGqlClient();
    expect(client.url).toBe(location.origin);
  });

  it('sets up a new Urql GraphQL client with the given URL', () => {
    const client = setupGqlClient({
      url: 'https://foo.com',
    });
    expect(client.url).toBe('https://foo.com');
  });
});
