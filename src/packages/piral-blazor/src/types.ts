import { ForeignComponent } from 'piral-core';
import { BootJsonData } from './internal';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletBlazorApi {}

  interface PiralCustomComponentConverters<TProps> {
    blazor(component: BlazorComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface BlazorComponent<TProps> {
  /**
   * The name of the Blazor module to render.
   */
  moduleName: string;
  /**
   * The args to transport into activation function.
   */
  args: TProps;
  /**
   * The type of the Blazor component.
   */
  type: 'blazor';
}

/**
 * Defines the provided set of Blazor Pilet API extensions.
 */
export interface PiletBlazorApi {
  /**
   * Sets up the blazor application using its boot data.
   * @param cfg The configuration to use for the set up.
   */
  setupBlazor(cfg: BootJsonData): void;
  /**
   * Wraps a Blazor module for use in Piral.
   * @param moduleName The name of the exposed Blazor component.
   * @param args The props to use as arguments for the Blazor component.
   * @returns The Piral Blazor component.
   */
  fromBlazor<TProps>(moduleName: string, args: TProps): BlazorComponent<TProps>;
}
