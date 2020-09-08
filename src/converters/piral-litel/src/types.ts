import type { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLitElApi {}

  interface PiralCustomComponentConverters<TProps> {
    litel(component: LitElComponent): ForeignComponent<TProps>;
  }
}

export interface LitElComponent {
  /**
   * The name of the LitElement root component to render.
   */
  elementName: string;
  /**
   * The type of the LitElement component.
   */
  type: 'litel';
}

/**
 * Defines the provided set of LitElement Pilet API extensions.
 */
export interface PiletLitElApi {
  /**
   * Wraps a LitElement component for use in Piral.
   * @param component The name of the root component.
   * @returns The Piral LitElement component.
   */
  fromLitEl(elementName: string): LitElComponent;
  /**
   * Gets the name of the LitElement extension.
   */
  LitElExtension: string;
}
