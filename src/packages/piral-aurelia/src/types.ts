import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletAureliaApi {}

  interface PiralCustomComponentConverters<TProps> {
    aurelia(component: AureliaComponent<TProps>): ForeignComponent<TProps>;
  }
}

export type AureliaModule<TProps> = any;

export interface AureliaComponent<TProps> {
  /**
   * The component root.
   */
  root: AureliaModule<TProps>;
  /**
   * The type of the Aurelia component.
   */
  type: 'aurelia';
}

/**
 * Defines the provided set of Aurelia Pilet API extensions.
 */
export interface PiletAureliaApi {
  /**
   * Wraps an Aurelia component for use in Piral.
   * @param component The component root.
   * @returns The Piral Aurelia component.
   */
  fromAurelia<TProps>(component: AureliaModule<TProps>): AureliaComponent<TProps>;
  /**
   * Aurelia component for displaying extensions of the given name.
   */
  AureliaExtension: AureliaModule<ExtensionSlotProps>;
}
