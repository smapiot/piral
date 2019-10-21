import { Component } from 'vue';
import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletVueApi {}

  interface PiralCustomComponentConverters<TProps> {
    vue(component: VueComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface VueComponent<TProps> {
  /**
   * The root component of Vue rendering tree.
   */
  root: Component<TProps>;
  /**
   * The type of the Vue component.
   */
  type: 'vue';
}

/**
 * Defines the provided set of Vue Pilet API extensions.
 */
export interface PiletVueApi {
  /**
   * Vue component for displaying extensions of the given name.
   */
  VueExtension: Component<ExtensionSlotProps>;
}
