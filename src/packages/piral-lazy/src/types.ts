import { ForeignComponent, FirstParametersOf, ComponentConverters } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLazyApi {}

  interface PiralCustomComponentConverters<TProps> {
    lazy(component: LazyComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface LazyComponentLoader<TProps> {
  (): Promise<FirstParametersOf<ComponentConverters<TProps>>>;
  current?: Promise<ForeignComponent<TProps>>;
}

export interface LazyComponent<TProps> {
  /**
   * Triggers the async loading process of the component.
   */
  load: LazyComponentLoader<TProps>;
  /**
   * The type of the lazy component.
   */
  type: 'lazy';
}

/**
 * Defines the provided set of lazy loading Pilet API extensions.
 */
export interface PiletLazyApi {
  /**
   * Properly introduces a lazy loaded foreign component.
   * @param cb The callback to trigger when the component should be loaded.
   * @returns The lazy loading component.
   */
  fromLazy<T>(cb: LazyComponentLoader<T>): LazyComponent<T>;
}
