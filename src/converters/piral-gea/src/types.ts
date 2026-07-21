import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';

export interface GeaComponentInstance<TProps> {
  props: TProps;
  render(parent: Node, index?: number): void;
  flushSync(): void;
  dispose(): void;
}

export type GeaComponentType<TProps> = new () => GeaComponentInstance<TProps>;

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletGeaApi {}

  interface PiralCustomComponentConverters<TProps> {
    gea(component: GeaComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface GeaComponent<TProps> {
  /**
   * The component root.
   */
  root: GeaComponentType<TProps>;
  /**
   * The type of the Gea component.
   */
  type: 'gea';
}

/**
 * Defines the provided set of Pilet API extensions from the Gea plugin.
 */
export interface PiletGeaApi {
  /**
   * Wraps a Gea component for use in Piral.
   * @param component The component root.
   * @returns The Piral Gea component.
   */
  fromGea<TProps>(component: GeaComponentType<TProps>): GeaComponent<TProps>;
  /**
   * Gea component for displaying extensions of the given name.
   */
  GeaExtension: GeaComponentType<ExtensionSlotProps>;
}
