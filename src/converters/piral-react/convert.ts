import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface ReactConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createReactConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: ReactConverter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromReact, Extension: ReactExtension } = createReactConverter();

export { fromReact, ReactExtension };
