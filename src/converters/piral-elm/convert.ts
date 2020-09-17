import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface ElmConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromElm: ElmConverter = (main, captured) => ({
  type: 'html',
  component: convert(main, captured),
});

export const createElmExtension = createExtension;
