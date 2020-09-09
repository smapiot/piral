import type { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletEmberApi {}

  interface PiralCustomComponentConverters<TProps> {
    ember(component: PiralEmberComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface EmberOptions<TProps> {
  props: TProps;
  ctx: any;
}

export interface EmberInstance<TProps> {
  setProperties(opts: EmberOptions<TProps>): void;
  destroy(): void;
}

export interface EmberModule<TProps> {
  create(opts: EmberOptions<TProps>): EmberInstance<TProps>;
}

export interface PiralEmberComponent<TProps> {
  /**
   * The Ember.js component App.
   */
  App: EmberModule<TProps>;
  /**
   * The Ember.js component options.
   */
  opts: any;
  /**
   * The type of the Ember.js component.
   */
  type: 'ember';
}

/**
 * Defines the provided set of Pilet API extensions from the Ember.js plugin.
 */
export interface PiletEmberApi {
  /**
   * Loads an ember application via it's URLs.
   * @param appName The name of the ember application.
   * @param appUrl The URL of the main ember application.
   * @param vendorUrl The optional URL of the (shared) ember vendor bundle.
   * @returns The promise resolving to the loaded ember application.
   */
  loadEmberApp<T = any>(appName: string, appUrl: string, vendorUrl?: string): Promise<T>;
  /**
   * Wraps an Emberjs component for use in Piral.
   * @param App The component root.
   * @param opts The component options.
   * @returns The Piral Ember.js component.
   */
  fromEmber<TProps>(App: EmberModule<TProps>, opts: any): PiralEmberComponent<TProps>;
  /**
   * Gets the name of the Ember.js extension.
   */
  EmberExtension: string;
}
