import { rc } from '../external';
import { NpmClientType, PiletSchemaVersion } from '../types';
import { SourceLanguage } from './enums';
import { defaultRegistry } from './constants';

export interface PiralCliConfig {
  /**
   * Key to be used for all servers in case there is
   * no specialized key in apiKeys specified.
   */
  apiKey?: string;
  /**
   * Feed URL to API key specifications.
   */
  apiKeys?: Record<string, string>;
  /**
   * URL to be used for publishing a pilet in case
   * there is no specialized key in url specified.
   */
  url?: string;
  /**
   * Path to a custom certificate file.
   */
  cert?: string;
  /**
   * Selects the default npm client to use.
   */
  npmClient?: NpmClientType;
  /**
   * Selects the default bundler to use, if
   * none given and found.
   */
  bundler?: string;
  /**
   * Selects the default pilet API path to use.
   */
  piletApi?: string;
  /**
   * Sets the validators configuration for a Piral instance.
   */
  validators?: Record<string, any>;
  /**
   * Sets the schema version to be used for pilets.
   */
  schemaVersion?: PiletSchemaVersion;
  /**
   * Automatically open the browser.
   */
  openBrowser?: boolean;
  /**
   * Port number.
   */
  port?: number;
  /**
   * Template language.
   */
  language?: SourceLanguage;
  /**
   * Host name.
   */
  host?: string;
  /**
   * Npm registry.
   */
  registry?: string;
}

export const config: PiralCliConfig = rc('piral', {
  apiKey: undefined,
  apiKeys: {},
  url: undefined,
  cert: undefined,
  npmClient: 'npm',
  bundler: 'webpack',
  piletApi: '/$pilet-api',
  validators: {},
  schemaVersion: 'v2',
  openBrowser: false,
  port: 1234,
  language: SourceLanguage.ts,
  host: 'localhost',
  registry: defaultRegistry,
}, {});
