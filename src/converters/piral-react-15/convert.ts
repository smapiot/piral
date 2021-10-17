import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface React15Converter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createReact15Converter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: React15Converter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromReact15, Extension: React15Extension } = createReact15Converter();

export { fromReact15, React15Extension };
