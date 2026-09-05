import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import type { Component } from 'solid-js';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletSolidApi {}

  interface PiralCustomComponentConverters<TProps> {
    solid(component: SolidComponent<TProps & Record<string, any>>): ForeignComponent<TProps>;
  }
}

export interface SolidComponent<TProps extends Record<string, any>> {
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
  fromSolid<TProps extends Record<string, any>>(root: Component<TProps>): SolidComponent<TProps>;
  /**
   * Gets the name of the Solid extension.
   */
  SolidExtension: Component<ExtensionSlotProps>;
}
