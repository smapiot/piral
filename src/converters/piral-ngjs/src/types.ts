import { IModule } from 'angular';
import { ForeignComponent } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletNgjsApi {}

  interface PiralCustomComponentConverters<TProps> {
    ngjs(component: NgjsComponent): ForeignComponent<TProps>;
  }
}

export interface NgjsComponent {
  /**
   * The module root.
   */
  root: IModule;
  /**
   * The name of the component.
   */
  name: string;
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
   * Wraps an Angular.js module for use in Piral.
   * @param name The name of the component.
   * @param root The module root.
   * @returns The Piral Ngjs component.
   */
  fromNgjs(name: string, root: IModule): NgjsComponent;
  /**
   * Angular.js component for displaying extensions of the given name.
   */
  NgjsExtension: IModule;
}
