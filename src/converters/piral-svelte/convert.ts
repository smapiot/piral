import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface SvelteConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromSvelte: SvelteConverter = (Component, captured) => ({
  type: 'html',
  component: convert(Component, captured),
});

export const createSvelteExtension = createExtension;
