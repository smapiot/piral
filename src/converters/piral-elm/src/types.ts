import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletElmApi {}

  interface PiralCustomComponentConverters<TProps> {
    elm(component: ElmComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface ElmModule<TProps> {
  init(opts: { node: Element; flags?: TProps }): void;
}

export interface ElmComponent<TProps> {
  /**
   * The name of the Elm main module to render.
   */
  main: ElmModule<TProps>;
  /**
   * Captures props for transport into the Elm component.
   */
  captured?: Record<string, any>;
  /**
   * The type of the Elm component.
   */
  type: 'elm';
}

/**
 * Defines the provided set of Elm Pilet API extensions.
 */
export interface PiletElmApi {
  /**
   * Wraps a Elm module for use in Piral.
   * @param main The name of the root component.
   * @param captured The optionally captured props.
   * @returns The Piral Elm component.
   */
  fromElm<TProps>(main: ElmModule<TProps>, captured?: Record<string, any>): ElmComponent<TProps>;
  /**
   * Gets the name of the Elm extension.
   */
  ElmExtension: string;
}
