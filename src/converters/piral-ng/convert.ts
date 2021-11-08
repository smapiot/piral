import type { HtmlComponent } from 'piral-core';
import { createConverter } from './esm/converter';

export interface NgConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createNgConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const defineModule = convert.defineModule;
  const from: NgConverter = (component) => ({
    type: 'html',
    component: convert(component),
  });

  return { from, Extension, defineModule };
}

const { from: fromNg, Extension: NgExtension, defineModule: defineNgModule } = createNgConverter();

export { fromNg, NgExtension, defineNgModule };
