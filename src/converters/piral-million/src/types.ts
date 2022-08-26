import type { VNode } from 'million';
import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletMillionApi {}

  interface PiralCustomComponentConverters<TProps> {
    million(component: MillionComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface MillionComponent<TProps> {
  /**
   * The component root.
   */
  root: (props: TProps) => VNode;
  /**
   * The type of the Million component.
   */
  type: 'million';
}

/**
 * Defines the provided set of Million Pilet API extensions.
 */
export interface PiletMillionApi {
  /**
   * Wraps an Million component for use in Piral.
   * @param component The component root.
   * @returns The Piral Million component.
   */
  fromMillion<TProps>(component: (props: TProps) => VNode): MillionComponent<TProps>;
  /**
   * Million component for displaying extensions of the given name.
   */
  MillionExtension: (props: ExtensionSlotProps) => VNode;
}
