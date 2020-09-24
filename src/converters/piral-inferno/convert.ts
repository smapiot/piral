import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface InfernoConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromInferno: InfernoConverter = (root) => ({
  type: 'html',
  component: convert(root),
});

export const createInfernoExtension = createExtension;
