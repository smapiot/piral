import type { PlatformRef, NgModuleRef } from '@angular/core';
import type { ForeignComponent } from 'piral-core';

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
 * Represents the interface implemented by a module definer function.
 */
export interface NgModuleDefiner {
  /**
   * Defines the module to use when bootstrapping the Angular pilet.
   * @param ngModule The module to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   */
  (module: any, opts?: NgOptions): void;
}

export interface NgComponent {
  /**
   * The component root.
   */
  component: any;
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
  fromNg(component: any): NgComponent;
  /**
   * Angular component for displaying extensions of the given name.
   */
  NgExtension: any;
}
