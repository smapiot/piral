import { ComponentType, LazyExoticComponent } from 'react';
import { FirstParametersOf, ComponentConverters } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLazyApi {}
}

export interface LazyComponentLoader<TProps> {
  (): Promise<FirstParametersOf<ComponentConverters<TProps>>>;
}

export interface LazyDependencyLoader {
  (): Promise<any>;
}

/**
 * Defines the provided set of lazy loading Pilet API extensions.
 */
export interface PiletLazyApi {
  /**
   * Defines a dependency for lazy loading.
   * @param name The name of the dependency.
   * @param loader The associated dependency loader.
   */
  defineDependency(name: string, loader: LazyDependencyLoader): void;
  /**
   * Properly introduces a lazy loaded foreign component.
   * @param cb The callback to trigger when the component should be loaded.
   * @param deps The optional names of the dependencies to load beforehand.
   * @returns The lazy loading component.
   */
  fromLazy<T>(cb: LazyComponentLoader<T>, deps?: Array<string>): LazyExoticComponent<ComponentType<T>>;
}
