import { createConverter } from './lib/converter';
import type { Type, LazyType, NgModuleFlags, NgOptions } from './lib/types';

export * from './lib/injection';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface NgConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export interface NgComponentLoader {
  (selector: string): HtmlComponent<any>;
}

export interface NgModuleDefiner {
  /**
   * Defines the module to use when bootstrapping the Angular pilet.
   * @param ngModule The module to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   * @param flags The flags to use when dealing with the module.
   */
  <T>(module: Type<T>, opts?: NgOptions, flags?: NgModuleFlags): void;
  /**
   * Defines the module to lazy load for bootstrapping the Angular pilet.
   * @param getModule The module lazy loader to use for running Angular.
   * @param opts The options to pass when bootstrapping.
   * @param flags The flags to use when dealing with the module.
   * @returns The module ID to be used to reference components.
   */
  <T>(getModule: LazyType<T>, opts?: NgOptions, flags?: NgModuleFlags): NgComponentLoader;
}

export function createNgConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;

  const from: NgConverter = (component) => ({
    type: 'html',
    component: convert(component),
  });

  // @ts-ignore
  const defineModule: NgModuleDefiner = (...args: Parameters<typeof convert.defineModule>) => {
    const lazy = convert.defineModule(...args);

    if (typeof lazy === 'function') {
      // @ts-ignore
      return (selector: string) => from(lazy(selector).component);
    }
  };

  return { from, Extension, defineModule };
}

const { from: fromNg, Extension: NgExtension, defineModule: defineNgModule } = createNgConverter();

export { fromNg, NgExtension, defineNgModule };
