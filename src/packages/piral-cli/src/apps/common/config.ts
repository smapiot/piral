const rc = require('rc');

export const config = rc('piral', {
  /**
   * Key to be used for all servers in case there is
   * no specialized key in apiKeys specified.
   */
  apiKey: '',
  /**
   * Hostname to API key specifications.
   */
  apiKeys: {},
});
