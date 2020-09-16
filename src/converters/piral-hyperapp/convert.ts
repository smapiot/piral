import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface HyperappConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromHyperapp: HyperappConverter = (root, state, actions) => ({
  type: 'html',
  component: convert(root, state, actions),
});

export const createHyperappExtension = createExtension;
