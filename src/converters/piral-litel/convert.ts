import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface LitElConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromLitEl: LitElConverter = (elementName) => ({
  type: 'html',
  component: convert(elementName),
});

export const createLitElExtension = createExtension;
