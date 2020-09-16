import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface NgConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromNg: NgConverter = (component) => ({
  type: 'html',
  component: convert(component),
});

export const createNgExtension = createExtension;
