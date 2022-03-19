import { createConverter } from './esm/converter';

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

export function createNgConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const defineModule = convert.defineModule;
  const from: NgConverter = (component) => ({
    type: 'html',
    component: convert(component),
  });

  return { from, Extension, defineModule };
}

const { from: fromNg, Extension: NgExtension, defineModule: defineNgModule } = createNgConverter();

export { fromNg, NgExtension, defineNgModule };
