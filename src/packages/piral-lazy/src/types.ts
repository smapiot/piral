import { ForeignComponent, FirstParametersOf, ComponentConverters } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLazyApi {}

  interface PiralCustomComponentConverters<TProps> {
    lazy(component: LazyComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface DependencyCache {
  [name: string]: {
    result: Promise<any>;
    loader: LazyDependencyLoader;
  };
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
   * The promises resolving in the optional dependencies.
   */
  deps?: Array<Promise<any>>;
  /**
   * The type of the lazy component.
   */
  type: 'lazy';
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
  fromLazy<T>(cb: LazyComponentLoader<T>, deps?: Array<string>): LazyComponent<T>;
}
