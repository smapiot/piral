import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface VueConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createVueConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: VueConverter = (root, captured) => ({
    type: 'html',
    component: convert(root, captured),
  });

  return { from, Extension };
}

const { from: fromVue, Extension: VueExtension } = createVueConverter();

export { fromVue, VueExtension };
