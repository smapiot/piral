import type { PlatformRef } from '@angular/core';
import type { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgApi {}

  interface PiralCustomComponentConverters<TProps> {
    ng(component: NgComponent): ForeignComponent<TProps>;
  }
}

export type NgOptions = Parameters<PlatformRef['bootstrapModule']>[1];

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
   * Options passed through to Angular `bootstrapModule`.
   *
   * Mainly to specify Noop Zone, but also includes compiler specific settings.
   * See https://angular.io/api/core/PlatformRef#bootstrapModule for possible values.
   */
  opts: NgOptions;
}

/**
 * Defines the provided set of Angular Pilet API extensions.
 */
export interface PiletNgApi {
  /**
   * Wraps an Angular component for use in Piral.
   * @param component The component root.
   * @returns The Piral Ng component.
   */
  fromNg(component: any, opts?: NgOptions): NgComponent;
  /**
   * Angular component for displaying extensions of the given name.
   */
  NgExtension: any;
}
