import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletBlazorApi {}

  interface PiralCustomComponentConverters<TProps> {
    blazor(component: BlazorComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface BlazorModule<TProps> {
  attach(opts: { container: Element; props?: TProps }): void;
}

export interface BlazorComponent<TProps> {
  /**
   * The name of the Blazor module to render.
   */
  module: BlazorModule<TProps>;
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
   * Wraps a Blazor module for use in Piral.
   * @param main The name of the root component.
   * @returns The Piral Blazor component.
   */
  fromBlazor<TProps>(main: BlazorModule<TProps>): BlazorComponent<TProps>;
  /**
   * Gets the name of the Blazor extension.
   */
  BlazorExtension: string;
}
