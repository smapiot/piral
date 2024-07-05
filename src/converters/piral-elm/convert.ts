import { createConverter } from './lib/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface ElmConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createElmConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: ElmConverter = (main, captured) => ({
    type: 'html',
    component: convert(main, captured),
  });

  return { from, Extension };
}

const { from: fromElm, Extension: ElmExtension } = createElmConverter();

export { fromElm, ElmExtension };
