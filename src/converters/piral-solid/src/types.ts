import { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import { Component } from 'solid-js';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletSolidApi {}

  interface PiralCustomComponentConverters<TProps> {
    solid(component: SolidComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface SolidComponent<TProps> {
  /**
   * The component root.
   */
  root: Component<TProps>;
  /**
   * The type of the Solid component.
   */
  type: 'solid';
}

/**
 * Defines the provided set of Solid Pilet API extensions.
 */
export interface PiletSolidApi {
  /**
   * Wraps a Solid component for use in Piral.
   * @param component The name of the root component.
   * @returns The Piral Solid component.
   */
  fromSolid<TProps>(root: Component<TProps>): SolidComponent<TProps>;
  /**
   * Gets the name of the Solid extension.
   */
  SolidExtension: Component<ExtensionSlotProps>;
}
