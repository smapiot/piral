import type { Component } from 'vue';
import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';

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
  /**
   * Captures props for transport into the Vue component.
   */
  captured?: Record<string, any>;
}

/**
 * Defines the provided set of Vue Pilet API extensions.
 */
export interface PiletVueApi {
  /**
   * Wraps a Vue component for use in Piral.
   * @param component The root component.
   * @param captured The optionally captured props.
   * @returns The Piral Vue component.
   */
  fromVue<TProps>(component: Component<TProps>, captured?: Record<string, any>): VueComponent<TProps>;
  /**
   * Vue component for displaying extensions of the given name.
   */
  VueExtension: Component<ExtensionSlotProps>;
}
