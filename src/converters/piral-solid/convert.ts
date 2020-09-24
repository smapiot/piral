import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface SolidConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromSolid: SolidConverter = (root) => ({
  type: 'html',
  component: convert(root),
});

export const createSolidExtension = createExtension;
