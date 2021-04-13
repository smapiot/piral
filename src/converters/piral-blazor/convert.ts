import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createDependencyLoader } from './lib/dependencies';

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
