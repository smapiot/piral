import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface RiotConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createRiotConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: RiotConverter = (component, captured) => ({
    type: 'html',
    component: convert(component, captured),
  });

  return { from, Extension };
}

const { from: fromRiot, Extension: RiotExtension } = createRiotConverter();

export { fromRiot, RiotExtension };
