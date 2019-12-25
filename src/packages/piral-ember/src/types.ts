import { ForeignComponent } from 'piral-core';

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
   * Wraps an Emberjs component for use in Piral.
   * @param App The component root.
   * @param opts The component options.
   * @returns The Piral Ember.js component.
   */
  fromEmber<TProps>(App: EmberModule<TProps>, opts: any): PiralEmberComponent<TProps>;
  /**
   * Ember.js component for displaying extensions of the given name.
   */
  EmberExtension: any;
}
