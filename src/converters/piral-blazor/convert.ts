import type { HtmlComponent } from 'piral-core';
import { createConverter } from './lib/converter';
import { createDependencyLoader } from './lib/dependencies';

function computePath() {
  try {
    throw new Error();
  } catch (t) {
    const e = ('' + t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (e) {
      return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/, '$1') + '/';
    }
  }

  return '/';
}

const convert = createConverter(computePath(), true);
const loader = createDependencyLoader(convert);

export interface BlazorConverter {
  (moduleName: string, args?: Record<string, any>): HtmlComponent<any>;
}

export const fromBlazor: BlazorConverter = (moduleName, args) => ({
  type: 'html',
  component: convert(moduleName, loader.getDependency(), args),
});

export const defineBlazorReferences = loader.defineBlazorReferences;
