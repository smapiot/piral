import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface NgjsConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createNgjsConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: NgjsConverter = (name, root) => ({
    type: 'html',
    component: convert(name, root),
  });

  return { from, Extension };
}

const { from: fromNgjs, Extension: NgjsExtension } = createNgjsConverter();

export { fromNgjs, NgjsExtension };
