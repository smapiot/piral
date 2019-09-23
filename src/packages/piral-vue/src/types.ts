import { FunctionalComponentOptions } from 'vue';
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
  root: FunctionalComponentOptions<TProps>;
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
   * Gets a Vue component for displaying extensions for the given name.
   * @param name The name of the extensions to display.
   * @returns The extension component to be used.
   */
  getVueExtension<T = any>(name: string): FunctionalComponentOptions<ExtensionSlotProps<T>>;
}
