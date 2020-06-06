import { rc } from '../external';
import { NpmClientType } from '../types';

export interface PiralCliConfig {
  apiKey?: string;
  apiKeys?: Record<string, string>;
  url?: string;
  cert?: string;
  npmClient?: NpmClientType;
  bundler?: string;
}

export const config: PiralCliConfig = rc('piral', {
  /**
   * Key to be used for all servers in case there is
   * no specialized key in apiKeys specified.
   */
  apiKey: undefined,
  /**
   * Hostname to API key specifications.
   */
  apiKeys: {},
  /**
   * URL to be used for publishing a pilet in case
   * there is no specialized key in url specified.
   */
  url: undefined,
  /**
   * Path to a custom certificate file.
   */
  cert: undefined,
  /**
   * Selects the default npm client to use.
   */
  npmClient: 'npm',
  /**
   * Selects the default bundler to use, if
   * none given and found.
   */
  bundler: 'parcel',
});
