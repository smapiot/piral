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
   * Gets an Angular component for displaying extensions for the given name.
   * @param name The name of the extensions to display.
   * @returns The extension component to be used.
   */
  getNgExtension<T = any>(name: string): any;
}
