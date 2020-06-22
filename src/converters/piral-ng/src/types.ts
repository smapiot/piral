import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgApi {}

  interface PiralCustomComponentConverters<TProps> {
    ng(component: NgComponent): ForeignComponent<TProps>;
  }
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
   * Wraps an Angular component for use in Piral.
   * @param component The component root.
   * @returns The Piral Ng component.
   */
  fromNg(component: any): NgComponent;
  /**
   * Angular component for displaying extensions of the given name.
   */
  NgExtension: any;
}
