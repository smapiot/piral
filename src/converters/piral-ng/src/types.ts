import type { PlatformRef, NgModuleRef } from '@angular/core';
import type { ForeignComponent } from 'piral-core';
import type { Type } from '@angular/core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgApi {}

  interface PiralCustomComponentConverters<TProps> {
    ng(component: NgComponent): ForeignComponent<TProps>;
  }
}

/**
 * Options passed through to Angular `bootstrapModule`.
 *
 * Mainly to specify Noop Zone, but also includes compiler specific settings.
 * See https://angular.io/api/core/PlatformRef#bootstrapModule for possible values.
 */
export type NgOptions = Parameters<PlatformRef['bootstrapModule']>[1];

export type ModuleInstanceResult = [any, NgOptions];

export type PrepareBootstrapResult = [...ModuleInstanceResult, any];

export type NgModuleInt = NgModuleRef<any> & { _destroyed: boolean };

/**
 * Gives you the ability to use a component from a lazy loaded module.
 */
export interface NgComponentLoader {
  /**
   * Uses a component from a lazy loaded module.
   * @param selector The selector defined for the component to load.
   */
  (selector: string): NgComponent;
}

export interface NgLazyType {
  selector: string;
  module: () => Promise<{ default: Type<any> }>;
  opts: NgOptions;
  state: any;
}

/**
 * The lazy loading interface for retrieving Angular components.
 */
export interface LazyType<T> {
  /**
   * Callback to be invoked for lazy loading an Angular module or component.
   */
  (): Promise<{ default: Type<T> }>;
}

/**
 * Represents the interface implemented by a module definer function.
 */
export interface NgModuleDefiner {
  /**
   * Defines the module to use when bootstrapping the Angular pilet.
   * @param ngModule The module to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   */
  <T>(module: Type<T>, opts?: NgOptions): void;
  /**
   * Defines the module to lazy load for bootstrapping the Angular pilet.
   * @param getModule The module lazy loader to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   * @returns The module ID to be used to reference components.
   */
  <T>(getModule: LazyType<T>, opts?: NgOptions): NgComponentLoader;
}

export interface NgComponent {
  /**
   * The component root.
   */
  component: Type<any> | NgLazyType;
  /**
   * The type of the Angular component.
   */
  type: 'ng';
}

/**
 * Defines the provided set of Angular Pilet API extensions.
 */
export interface PiletNgApi {
  /**
   * Defines the module to use when bootstrapping the Angular pilet.
   */
  defineNgModule: NgModuleDefiner;
  /**
   * Wraps an Angular component for use in Piral. Might reuse a previously
   * defined module if the component was exported from it.
   * Alternatively, a module might be passed in, where the first component
   * of either the bootstrap or the entryComponents declaration is used.
   * @param component The component root.
   * @returns The Piral Ng component.
   */
  fromNg<T>(component: Type<T>): NgComponent;
  /**
   * Angular component for displaying extensions of the given name.
   */
  NgExtension: any;
}
