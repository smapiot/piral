import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import type { ComponentType } from 'preact';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletPreactApi {}

  interface PiralCustomComponentConverters<TProps> {
    preact(component: PreactComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface PreactComponent<TProps> {
  /**
   * The component root.
   */
  root: ComponentType<TProps>;
  /**
   * The type of the Preact component.
   */
  type: 'preact';
}

/**
 * Defines the provided set of Preact Pilet API extensions.
 */
export interface PiletPreactApi {
  /**
   * Wraps an Preact component for use in Piral.
   * @param component The component root.
   * @returns The Piral Preact component.
   */
  fromPreact<TProps>(component: ComponentType<TProps>): PreactComponent<TProps>;
  /**
   * Preact component for displaying extensions of the given name.
   */
  PreactExtension: ComponentType<ExtensionSlotProps>;
}
