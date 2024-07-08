import { createConverter } from './lib/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface Vue3Converter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createVue3Converter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const defineMiddleware = convert.defineMiddleware;
  const from: Vue3Converter = (root, captured) => ({
    type: 'html',
    component: convert(root, captured),
  });

  return { from, Extension, defineMiddleware };
}

const { from: fromVue3, Extension: Vue3Extension, defineMiddleware: defineVue3Middleware } = createVue3Converter();

export { fromVue3, Vue3Extension, defineVue3Middleware };
