import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import type { Component, ComponentType } from 'react-15';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletReact15Api {}

  interface PiralCustomComponentConverters<TProps> {
    react15(component: React15Component<TProps>): ForeignComponent<TProps>;
  }
}

export interface React15Component<TProps> {
  /**
   * The component root.
   */
  root: ComponentType<TProps>;
  /**
   * The type of the React 15.x component.
   */
  type: 'react15';
}

/**
 * Defines the provided set of Pilet API extensions from the React 15.x plugin.
 */
export interface PiletReact15Api {
  /**
   * Wraps an React 15.x component for use in Piral.
   * @param component The component root.
   * @returns The Piral React 15.x component.
   */
  fromReact15<TProps>(component: ComponentType<TProps>): React15Component<TProps>;
  /**
   * React 15.x component for displaying extensions of the given name.
   */
  React15Extension: Component<ExtensionSlotProps>;
}
