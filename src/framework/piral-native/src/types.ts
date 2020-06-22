import { PiralConfiguration, ComponentsState, ErrorComponentsState } from 'piral-core';

/**
 * Defines the base options for rendering a Piral instance.
 */
export interface PiralRenderBaseOptions {
  /**
   * Defines how the layout looks like.
   */
  layout?: Partial<ComponentsState>;
  /**
   * Defines how the errors looks like.
   */
  errors?: Partial<ErrorComponentsState>;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralRenderOptions extends PiralRenderBaseOptions, PiralConfiguration {
  /**
   * Sets an optional middleware for adjusting the configuration.
   * @default cfg => cfg
   */
  middleware?: (config: PiralConfiguration) => PiralConfiguration;
}
