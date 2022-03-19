import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface LitElConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createLitElConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: LitElConverter = (elementName) => ({
    type: 'html',
    component: convert(elementName),
  });

  return { from, Extension };
}

const { from: fromLitEl, Extension: LitElExtension } = createLitElConverter();

export { fromLitEl, LitElExtension };
