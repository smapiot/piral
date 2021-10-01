import type { PlatformRef, NgModuleRef } from '@angular/core';
import type { ForeignComponent, PiletApi } from 'piral-core';

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

export interface NgModuleDefiner {
  (piral: PiletApi, module: any, opts?: NgOptions): string;
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
  /**
   * The module ref to use.
   */
  moduleRef?: string;
}

/**
 * Defines the provided set of Angular Pilet API extensions.
 */
export interface PiletNgApi {
  /**
   * Defines the module to use when bootstrapping the Angular pilet.
   * @param ngModule The module to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   * @returns The module ref for running.
   */
  defineNgModule(ngModule: any, opts?: NgOptions): string;
  /**
   * Wraps an Angular component for use in Piral.
   * If the moduleRef is not given it uses the first defined module, if any.
   * The fallback is the default module.
   * @param component The component root.
   * @param moduleRef The module ref to bootstrap in the right Angular tree.
   * @returns The Piral Ng component.
   */
  fromNg(component: any, moduleRef?: string): NgComponent;
  /**
   * Angular component for displaying extensions of the given name.
   */
  NgExtension: any;
}
