import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface CycleConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createCycleConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: CycleConverter = (main) => ({
    type: 'html',
    component: convert(main),
  });

  return { from, Extension };
}

const { from: fromCycle, Extension: CycleExtension } = createCycleConverter();

export { fromCycle, CycleExtension };
