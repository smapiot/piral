import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface NgConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createNgConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: NgConverter = (component) => ({
    type: 'html',
    component: convert(component),
  });

  return { from, Extension };
}

const { from: fromNg, Extension: NgExtension } = createNgConverter();

export { fromNg, NgExtension };
