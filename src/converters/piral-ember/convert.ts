import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface EmberConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromEmber: EmberConverter = (App, opts) => ({
  type: 'html',
  component: convert(App, opts),
});

export const createEmberExtension = createExtension;
