import { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import { Component, ComponentType } from 'inferno';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletInfernoApi {}

  interface PiralCustomComponentConverters<TProps> {
    inferno(component: InfernoComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface InfernoComponent<TProps> {
  /**
   * The component root.
   */
  root: ComponentType<TProps>;
  /**
   * The type of the Inferno component.
   */
  type: 'inferno';
}

/**
 * Defines the provided set of Pilet API extensions from the Inferno plugin.
 */
export interface PiletInfernoApi {
  /**
   * Wraps an Inferno component for use in Piral.
   * @param component The component root.
   * @returns The Piral Inferno component.
   */
  fromInferno<TProps>(component: ComponentType<TProps>): InfernoComponent<TProps>;
  /**
   * Inferno component for displaying extensions of the given name.
   */
  InfernoExtension: Component<ExtensionSlotProps>;
}
