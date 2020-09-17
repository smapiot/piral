import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface MithrilConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromMithril: MithrilConverter = (component, captured) => ({
  type: 'html',
  component: convert(component, captured),
});

export const createMithrilExtension = createExtension;
