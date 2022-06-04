import type { ForeignComponent } from 'piral-core';

declare global {
  interface Window {
    Blazor: any;
    DotNet: any;
    $blazorLoader: Promise<HTMLDivElement>;
  }
}

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletBlazorApi {}

  interface PiralCustomComponentConverters<TProps> {
    blazor(component: BlazorComponent): ForeignComponent<TProps>;
  }
}

/**
 * Additional options for the Blazor component
 */
export interface BlazorOptions {
  /**
   * The root path where resources are located
   */
  resourcePathRoot?: string;
}

export interface BlazorComponent {
  /**
   * The name of the Blazor module to render.
   */
  moduleName: string;
  /**
   * The args to transport into activation function.
   */
  args?: Record<string, any>;
  /**
   * An optional dependency that needs to load before
   * the component can be properly displayed.
   */
  dependency?: () => Promise<void>;
  /**
   * The type of the Blazor component.
   */
  type: 'blazor';
  /**
   * Additional options for the Blazor component.
   */
  options?: BlazorOptions;
}

/**
 * Defines the provided set of Blazor Pilet API extensions.
 */
export interface PiletBlazorApi {
  /**
   * Defines the additional libraries (and their symbols) to Blazor via
   * their URLs.
   *
   * @param referenceUrls The URLs pointing to the different DLLs to include.
   */
  defineBlazorReferences(referenceUrls: Array<string>): void;
  /**
   * Wraps a Blazor module for use in Piral.
   *
   * @param moduleName The name of the exposed Blazor component.
   * @param args The optional props to use as arguments for the Blazor component.
   * @returns The Piral Blazor component.
   */
  fromBlazor(moduleName: string, args?: Record<string, any>): BlazorComponent;
  /**
   * Defines the additional options to be shared by all Blazor components.
   *
   * @param options The options for the Blazor components.
   */
  defineBlazorOptions(options: BlazorOptions): void;
  /**
   * Releases all defined blazor references from the current pilet.
   */
  releaseBlazorReferences(): void;
}
