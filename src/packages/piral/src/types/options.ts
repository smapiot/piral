import { PiralConfiguration, ComponentsState, ErrorComponentsState } from 'piral-core';
import { PiralExtSettings } from 'piral-ext';

/**
 * Defines the base options for rendering a Piral instance.
 */
export interface PiralRenderBaseOptions extends PiralConfiguration {
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
export interface PiralRenderOptions extends PiralRenderBaseOptions {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
}
