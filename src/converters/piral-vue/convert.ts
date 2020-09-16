import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface VueConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromVue: VueConverter = (root, captured) => ({
  type: 'html',
  component: convert(root, captured),
});

export const createVueExtension = createExtension;
