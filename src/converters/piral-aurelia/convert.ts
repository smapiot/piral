import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface AureliaConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromAurelia: AureliaConverter = (root) => ({
  type: 'html',
  component: convert(root),
});

export const createAureliaExtension = createExtension;
