import { ReactElement, ReactNode } from 'react';
import { PiralConfiguration, ComponentsState, ErrorComponentsState, LayoutBreakpoints } from 'piral-core';
import { PiralExtSettings } from 'piral-ext';

/**
 * Defines the base options for rendering a Piral instance.
 * @deprecated Use `createInstance` directly.
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
   * Defines the breakpoints to use for responsive layouts.
   */
  breakpoints?: LayoutBreakpoints;
  /**
   * Defines how the errors look like.
   */
  errors?: Partial<ErrorComponentsState>;
  /**
   * Defines the path of the dashboard. By default
   * this is the landing page path.
   * @default "/"
   */
  dashboardPath?: string;
  /**
   * Puts in additional children for the <Piral> element.
   */
  piralChildren?: ReactNode;
}

/**
 * Defines the options for rendering a Piral instance.
 * @deprecated Use `createInstance` directly.
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
 * @deprecated Use `createInstance` directly.
 */
export interface PiralRunner {
  (app: ReactElement, selector: string | Element): void;
}
