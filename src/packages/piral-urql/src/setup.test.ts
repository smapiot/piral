import { setupGqlClient } from './setup';

describe('Piral-Urql setup module', () => {
  it('sets up a new Urql GraphQL client', () => {
    const client = setupGqlClient();
  });
});
