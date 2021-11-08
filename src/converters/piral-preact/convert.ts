import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface PreactConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createPreactConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: PreactConverter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromPreact, Extension: PreactExtension } = createPreactConverter();

export { fromPreact, PreactExtension };
