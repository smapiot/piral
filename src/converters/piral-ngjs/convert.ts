import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface NgjsConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromNgjs: NgjsConverter = (name, root) => ({
  type: 'html',
  component: convert(name, root),
});

export const createNgjsExtension = createExtension;
