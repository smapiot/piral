import { Dict } from 'piral-core';
import { Schema } from 'jsonschema';

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
   */
  defineConfigSchema<T = any>(schema: Schema, defaultConfig?: T): void;
  /**
   * Gets the currently available configuration.
   */
  getCurrentConfig<T = any>(): T;
}
