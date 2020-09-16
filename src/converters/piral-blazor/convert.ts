import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createDependencyLoader } from './lib/dependencies';

const convert = createConverter();
const loader = createDependencyLoader(convert);

export interface BlazorConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromBlazor: BlazorConverter = (moduleName, dependency, args) => ({
  type: 'html',
  component: convert(moduleName, dependency, args),
});

export const defineBlazorReferences = loader.defineBlazorReferences;
