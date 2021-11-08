import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface MithrilConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createMithrilConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: MithrilConverter = (component, captured) => ({
    type: 'html',
    component: convert(component, captured),
  });

  return { from, Extension };
}

const { from: fromMithril, Extension: MithrilExtension } = createMithrilConverter();

export { fromMithril, MithrilExtension };
