import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface Vue3Converter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromVue3: Vue3Converter = (root, captured) => ({
  type: 'html',
  component: convert(root, captured),
});

export const createVue3Extension = createExtension;
