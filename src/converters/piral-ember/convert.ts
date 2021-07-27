import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface EmberConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createEmberConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: EmberConverter = (App, opts) => ({
    type: 'html',
    component: convert(App, opts),
  });

  return { from, Extension };
}

const { from: fromEmber, Extension: EmberExtension } = createEmberConverter();

export { fromEmber, EmberExtension };
