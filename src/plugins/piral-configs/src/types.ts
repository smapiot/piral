import type { Dict } from 'piral-core';
import type { Schema } from 'jsonschema';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletConfigsApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the available configurations.
     */
    configs: Dict<any>;
  }
}

/**
 * Defines the provided set of Pilet API extensions for configuration.
 */
export interface PiletConfigsApi {
  /**
   * Defines the available configuration options for the pilet.
   * @param schema The schema to use for allowing configurations.
   * @param defaultConfig The default configuration to use.
   * @returns The current configuration, which may be either the
   * default configuration or an override.
   */
  defineConfigSchema<T = any>(schema: Schema, defaultConfig?: T): T;
  /**
   * Gets the currently available configuration.
   */
  getCurrentConfig<T = any>(): T;
}
