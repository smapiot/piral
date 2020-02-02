import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletMithrilApi {}

  interface PiralCustomComponentConverters<TProps> {
    mithril(component: MithrilComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface ComponentProps<TProps> {
  attrs: TProps;
}

export interface Component<TProps> {
  view(vnode: ComponentProps<TProps>): any;
}

export interface MithrilComponent<TProps> {
  /**
   * The component.
   */
  component: Component<TProps>;
  /**
   * The type of the Mithril.js component.
   */
  type: 'mithril';
}

/**
 * Defines the provided set of Mithril.js Pilet API extensions.
 */
export interface PiletMithrilApi {
  /**
   * Wraps an Mithril.js component for use in Piral.
   * @param component The component root.
   * @returns The Piral Mithril.js component.
   */
  fromMithril<TProps>(component: Component<TProps>): MithrilComponent<TProps>;
  /**
   * Mithril.js component for displaying extensions of the given name.
   */
  MithrilExtension: Component<ExtensionSlotProps>;
}
