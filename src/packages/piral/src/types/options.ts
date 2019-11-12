import { PiralConfiguration, ComponentsState, ErrorComponentsState } from 'piral-core';
import { PiralExtSettings } from 'piral-ext';

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralRenderOptions extends PiralConfiguration {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Customizes the extension settings.
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
