import { createConverter } from './esm/converter';
import { createDependencyLoader } from './esm/dependencies';

export interface HtmlComponent<TProps> {
  component: {
    mount(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    update?(element: HTMLElement, props: TProps, ctx: any, locals: any): void;
    unmount?(element: HTMLElement, locals: any): void;
  };
  type: 'html';
}

const convert = createConverter(true);
const loader = createDependencyLoader(convert);

export interface BlazorConverter {
  (moduleName: string, args?: Record<string, any>): HtmlComponent<any>;
}

export const fromBlazor: BlazorConverter = (moduleName, args) => ({
  type: 'html',
  component: convert(moduleName, loader.getDependency(), args),
});

export const defineBlazorReferences = loader.defineBlazorReferences;
