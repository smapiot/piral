import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface SolidConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createSolidConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: SolidConverter = (root) => ({
    type: 'html',
    component: convert(root),
  });

  return { from, Extension };
}

const { from: fromSolid, Extension: SolidExtension } = createSolidConverter();

export { fromSolid, SolidExtension };
