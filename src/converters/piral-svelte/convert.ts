import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface SvelteConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createSvelteConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: SvelteConverter = (Component, captured) => ({
    type: 'html',
    component: convert(Component, captured),
  });

  return { from, Extension };
}

const { from: fromSvelte, Extension: SvelteExtension } = createSvelteConverter();

export { fromSvelte, SvelteExtension };
