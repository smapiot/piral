import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';

export interface ElmConverter {
  (...params: Parameters<ReturnType<typeof createConverter>>): HtmlComponent<any>;
}

export function createElmConverter(...params: Parameters<typeof createConverter>) {
  const convert = createConverter(...params);
  const Extension = convert.Extension;
  const from: ElmConverter = (main, captured) => ({
    type: 'html',
    component: convert(main, captured),
  });

  return { from, Extension };
}

const { from: fromElm, Extension: ElmExtension } = createElmConverter();

export { fromElm, ElmExtension };
