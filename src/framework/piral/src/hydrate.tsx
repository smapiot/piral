import { hydrate } from 'react-dom';
import { runInstance } from './run';
import { getContainer } from './options';
import { PiralRenderOptions } from './types';

/**
 * Sets up a new Piral instance and hydrates it using the provided options.
 * @param options The options to use when setting up the Piral instance.
 * @deprecated Use `createInstance` with `hydrate` directly.
 * @example
```ts
import { hydrateInstance } from 'piral';
hydrateInstance();
```
 */
export function hydrateInstance(options?: PiralRenderOptions) {
  return runInstance((app, selector) => hydrate(app, getContainer(selector)), options);
}
