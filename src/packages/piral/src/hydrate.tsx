import { hydrate } from 'react-dom';
import { runInstance } from './run';
import { getContainer } from './utils';
import { PiralRenderOptions } from './types';

/**
 * Sets up a new Piral instance and hydrates it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param options The options to use when setting up the Piral instance.
 * @example
```ts
import { hydrateInstance } from 'piral';
hydrateInstance();
```
 */
export function hydrateInstance(options?: PiralRenderOptions) {
  return runInstance((app, selector) => hydrate(app, getContainer(selector)), options);
}
