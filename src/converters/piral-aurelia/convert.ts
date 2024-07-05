import { createConverter } from './lib/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface AureliaConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createAureliaConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: AureliaConverter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromAurelia, Extension: AureliaExtension } = createAureliaConverter();

export { fromAurelia, AureliaExtension };
