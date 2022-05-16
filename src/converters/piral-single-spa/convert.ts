import { createConverter } from './esm/converter';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

export interface SingleSpaConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createSingleSpaConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const from: SingleSpaConverter = (elementName) => ({
    type: 'html',
    component: convert(elementName),
  });

  return { from };
}

const { from: fromSingleSpa } = createSingleSpaConverter();

export { fromSingleSpa };
