import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createExtension } from './lib/extension';

const convert = createConverter();

export interface CycleConverter {
  (...params: Parameters<typeof convert>): HtmlComponent<any>;
}

export const fromCycle: CycleConverter = (main) => ({
  type: 'html',
  component: convert(main),
});

export const createCycleExtension = createExtension;
