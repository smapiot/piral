import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface RiotConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromRiot: RiotConverter = (component, captured) => ({
  type: 'html',
  component: convert(component, captured),
});

export const createRiotExtension = createExtension;
