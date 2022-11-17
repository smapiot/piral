import { render } from 'react-dom';
import { getContainer } from './options';
import { PiralRenderOptions } from './types';
import { runInstance } from './run';

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * @param options The options to use when setting up the Piral instance.
 * @deprecated Use `createInstance` with `render` directly.
 * @example
```ts
import { renderInstance } from 'piral';
renderInstance();
```
 */
export function renderInstance(options?: PiralRenderOptions) {
  return runInstance((app, selector) => render(app, getContainer(selector)), options);
}
