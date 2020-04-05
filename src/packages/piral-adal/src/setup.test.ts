import { setupAdalClient } from './setup';

describe('Piral-Adal setup module', () => {
  it('created ADAL client is not logged in', () => {
    const client = setupAdalClient({
      clientId: '123',
    });
    const account = client.account();
    expect(account).toBeNull();
  });
});
