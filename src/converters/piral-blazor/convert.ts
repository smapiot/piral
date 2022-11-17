import { createConverter } from './esm/converter';
import { createDependencyLoader } from './esm/dependencies';
import type { BlazorOptions } from './esm/types';

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
let blazorOptions: BlazorOptions | undefined = undefined;

export interface BlazorConverter {
  (moduleName: string, args?: Record<string, any>): HtmlComponent<any>;
}

export function defineBlazorOptions(options: BlazorOptions) {
  blazorOptions = options;
}

export const fromBlazor: BlazorConverter = (moduleName, args = {}) => ({
  type: 'html',
  component: convert(moduleName, loader.getDependency(), args, blazorOptions),
});

export const defineBlazorReferences = loader.defineBlazorReferences;

export const releaseBlazorReferences = loader.releaseBlazorReferences;
