import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import type { Component, ComponentType } from 'react';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletReactApi {}

  interface PiralCustomComponentConverters<TProps> {
    react(component: ReactComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface ReactComponent<TProps> {
  /**
   * The component root.
   */
  root: ComponentType<TProps>;
  /**
   * The type of the React 16+ component.
   */
  type: 'react';
}

/**
 * Defines the provided set of Pilet API extensions from the React 16+ plugin.
 */
export interface PiletReactApi {
  /**
   * Wraps an React 16+ component for use in Piral.
   * @param component The component root.
   * @returns The Piral React 16+ component.
   */
  fromReact<TProps>(component: ComponentType<TProps>): ReactComponent<TProps>;
  /**
   * React 16+ component for displaying extensions of the given name.
   */
  ReactExtension: Component<ExtensionSlotProps>;
}
