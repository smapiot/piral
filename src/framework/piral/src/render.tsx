import { render } from 'react-dom';
import { getContainer } from './utils';
import { PiralRenderOptions } from './types';
import { runInstance } from './run';

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param options The options to use when setting up the Piral instance.
 * @example
```ts
import { renderInstance } from 'piral';
renderInstance();
```
 */
export function renderInstance(options?: PiralRenderOptions) {
  return runInstance((app, selector) => render(app, getContainer(selector)), options);
}
