import { ReactElement } from 'react';
import { PiralConfiguration, ComponentsState, ErrorComponentsState } from 'piral-core';
import { PiralExtSettings } from 'piral-ext';

/**
 * Defines the base options for rendering a Piral instance.
 */
export interface PiralRenderBaseOptions {
  /**
   * Customizes the plugin settings.
   */
  settings?: PiralExtSettings;
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
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Sets an optional middleware for adjusting the configuration.
   * @default cfg => cfg
   */
  middleware?: (config: PiralConfiguration) => PiralConfiguration;
}

/**
 * Defines how the runner for an app element looks like.
 */
export interface PiralRunner {
  (app: ReactElement, selector: string | Element): void;
}
