import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface React15Converter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromReact15: React15Converter = (root) => ({
  type: 'html',
  component: convert(root),
});

export const createReact15Extension = createExtension;
