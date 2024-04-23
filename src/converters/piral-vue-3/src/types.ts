import type { App, Component } from 'vue';
import type { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletVue3Api {}

  interface PiralCustomComponentConverters<TProps> {
    vue3(component: Vue3Component<TProps>): ForeignComponent<TProps>;
  }
}

/**
 * Defines a handler to set up Vue 3 middleware.
 */
export interface Vue3MiddlewareHandler {
  /**
   * Receives the app instance to integrate middleware.
   */
  (app: App<Element>): void;
}

export interface Vue3Component<TProps> {
  /**
   * The root component of Vue rendering tree.
   */
  root: Component<TProps>;
  /**
   * The type of the Vue component.
   */
  type: 'vue3';
  /**
   * Captures props for transport into the Vue component.
   */
  captured?: Record<string, any>;
}

/**
 * Defines the provided set of Vue Pilet API extensions.
 */
export interface PiletVue3Api {
  /**
   * Wraps a Vue component for use in Piral.
   * @param component The root component.
   * @param captured The optionally captured props.
   * @returns The Piral Vue component.
   */
  fromVue3<TProps>(component: Component<TProps>, captured?: Record<string, any>): Vue3Component<TProps>;
  /**
   * Vue component for displaying extensions of the given name.
   */
  Vue3Extension: Component<ExtensionSlotProps>;
  /**
   * Function to use for declaring a callback to setup additional middleware.
   */
  defineVue3Middleware(setup: Vue3MiddlewareHandler): void;
}
