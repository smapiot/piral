import { homedir } from 'os';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { appName, defaultRegistry } from './constants';
import { rc } from '../external';
import { AuthConfig, SourceLanguage, NpmClientType, PiletSchemaVersion } from '../types';

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
   * Emulator URL to auth options mapping.
   */
  auth?: Record<string, AuthConfig>;
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
   * Forces the set port to be used, otherwise exists with an error.
   */
  strictPort?: boolean;
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
  /**
   * Allow self-signed certificates.
   */
  allowSelfSigned?: boolean;
}

export const config: PiralCliConfig = rc(
  appName,
  {
    apiKey: undefined,
    apiKeys: {},
    auth: {},
    url: undefined,
    cert: undefined,
    npmClient: 'npm' as const,
    bundler: 'webpack5' as const,
    piletApi: '/$pilet-api',
    validators: {},
    schemaVersion: 'v2' as const,
    openBrowser: false,
    allowSelfSigned: false,
    port: 1234,
    strictPort: false,
    language: 'ts' as const,
    host: 'localhost',
    registry: defaultRegistry,
  },
  {},
);

function mergeConfig<T extends keyof PiralCliConfig>(
  existing: PiralCliConfig,
  area: T,
  value: Partial<PiralCliConfig[T]>,
) {
  const current = existing[area];

  // update already existing config
  Object.assign(existing, {
    [area]:
      typeof current === 'object'
        ? {
            ...current,
            ...value,
          }
        : value,
  });
}

export async function updateConfig<T extends keyof PiralCliConfig>(area: T, value: Partial<PiralCliConfig[T]>) {
  // update already existing config
  mergeConfig(config, area, value);

  // update user-global config
  const path = resolve(homedir(), `.${appName}rc`);
  const content = await readFile(path, 'utf8').catch(() => '{}');
  const configFile = JSON.parse(content);
  mergeConfig(configFile, area, value);
  await writeFile(path, JSON.stringify(configFile, undefined, 2), 'utf8');
}
