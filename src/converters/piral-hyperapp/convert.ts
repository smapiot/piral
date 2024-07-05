import { createConverter } from './lib/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface HyperappConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createHyperappConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: HyperappConverter = (root, state, actions) => ({
    type: 'html',
    component: convert(root, state, actions),
  });

  return { from, Extension };
}

const { from: fromHyperapp, Extension: HyperExtension } = createHyperappConverter();

export { fromHyperapp, HyperExtension };
