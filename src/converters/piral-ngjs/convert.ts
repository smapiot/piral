import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface NgjsConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createNgjsConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: NgjsConverter = (name, root) => ({
    type: 'html',
    component: convert(name, root),
  });

  return { from, Extension };
}

const { from: fromNgjs, Extension: NgjsExtension } = createNgjsConverter();

export { fromNgjs, NgjsExtension };
