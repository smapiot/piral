import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface LitElConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createLitElConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: LitElConverter = (elementName) => ({
    type: 'html',
    component: convert(elementName),
  });

  return { from, Extension };
}

const { from: fromLitEl, Extension: LitElExtension } = createLitElConverter();

export { fromLitEl, LitElExtension };
