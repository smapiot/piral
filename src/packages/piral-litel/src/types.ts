import { Component } from 'lit-element';
import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLitElApi {}

  interface PiralCustomComponentConverters<TProps> {
    litel(component: LitElComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface LitElComponent<TProps> {
  /**
   * The Lit Element root component to render.
   */
  component: Component<TProps>;
  /**
   * The type of the Lit Element component.
   */
  type: 'litel';
}

/**
 * Defines the provided set of Lit Element Pilet API extensions.
 */
export interface PiletLitElApi {
  /**
   * Wraps a Lit Element component for use in Piral.
   * @param component The root component.
   * @returns The Piral Lit Element component.
   */
  fromLitEl<TProps>(component: Component<TProps>): LitElComponent<TProps>;
  /**
   * Lit Element component for displaying extensions of the given name.
   */
  LitElExtension: Component<ExtensionSlotProps>;
}
