import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgApi {}

  interface PiralCustomComponentConverters {
    ng<TProps>(component: NgComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface NgComponent<TProps> {
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
export interface PiletNgApi {}
