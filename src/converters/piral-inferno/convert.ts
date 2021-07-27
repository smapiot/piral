import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface InfernoConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createInfernoConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: InfernoConverter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromInferno, Extension: InfernoExtension } = createInfernoConverter();

export { fromInferno, InfernoExtension };
