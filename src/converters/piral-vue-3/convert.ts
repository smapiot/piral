import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface Vue3Converter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createVue3Converter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: Vue3Converter = (root, captured) => ({
    type: 'html',
    component: convert(root, captured),
  });

  return { from, Extension };
}

const { from: fromVue3, Extension: Vue3Extension } = createVue3Converter();

export { fromVue3, Vue3Extension };
