import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface PreactConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromPreact: PreactConverter = (root) => ({
  type: 'html',
  component: convert(root),
});

export const createPreactExtension = createExtension;
