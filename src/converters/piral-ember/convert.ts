import { createConverter } from './lib/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface EmberConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createEmberConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: EmberConverter = (App, opts) => ({
    type: 'html',
    component: convert(App, opts),
  });

  return { from, Extension };
}

const { from: fromEmber, Extension: EmberExtension } = createEmberConverter();

export { fromEmber, EmberExtension };
