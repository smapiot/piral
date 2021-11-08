import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface HyperappConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createHyperappConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: HyperappConverter = (root, state, actions) => ({
    type: 'html',
    component: convert(root, state, actions),
  });

  return { from, Extension };
}

const { from: fromHyperapp, Extension: HyperExtension } = createHyperappConverter();

export { fromHyperapp, HyperExtension };
