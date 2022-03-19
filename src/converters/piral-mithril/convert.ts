import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface MithrilConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createMithrilConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: MithrilConverter = (component, captured) => ({
    type: 'html',
    component: convert(component, captured),
  });

  return { from, Extension };
}

const { from: fromMithril, Extension: MithrilExtension } = createMithrilConverter();

export { fromMithril, MithrilExtension };
