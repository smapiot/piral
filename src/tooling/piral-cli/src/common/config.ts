import { defaultRegistry } from './constants';
import { rc, parseStringsInObject } from '../external';
import { SourceLanguage, NpmClientType, PiletSchemaVersion } from '../types';

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

export const config: PiralCliConfig = parseStringsInObject(rc(
  'piral',
  {
    apiKey: undefined,
    apiKeys: {},
    url: undefined,
    cert: undefined,
    npmClient: 'npm' as const,
    bundler: 'webpack5' as const,
    piletApi: '/$pilet-api',
    validators: {},
    schemaVersion: 'v2' as const,
    openBrowser: false,
    port: 1234,
    language: 'ts' as const,
    host: 'localhost',
    registry: defaultRegistry,
  },
  {},
));
