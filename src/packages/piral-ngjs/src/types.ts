import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgjsApi {}

  interface PiralCustomComponentConverters<TProps> {
    ngjs(component: NgjsComponent): ForeignComponent<TProps>;
  }
}

export interface NgjsComponent {
  /**
   * The component root.
   */
  component: any;
  /**
   * The type of the Angular.js component.
   */
  type: 'ngjs';
}

/**
 * Defines the provided set of Angular Pilet API extensions.
 */
export interface PiletNgjsApi {
  /**
   * Wraps an Angular.js component for use in Piral.
   * @param component The component root.
   * @returns The Piral Ngjs component.
   */
  fromNgjs(component: any): NgjsComponent;
  /**
   * Angular.js component for displaying extensions of the given name.
   */
  NgjsExtension: any;
}
