import { isfunc } from 'piral-base';
import type { AvailableDependencies, PiletEntries } from '../types';
import { fillDependencies } from '../../app.codegen';

/**
 * The global dependencies, which represent the dependencies
 * shared from the app shell itself.
 */
export const globalDependencies: AvailableDependencies = {};

if (isfunc(fillDependencies)) {
  fillDependencies(globalDependencies);
}

/**
 * The default dependency selector, which just returns the provided
 * dependencies.
 */
export function defaultDependencySelector(dependencies: AvailableDependencies) {
  return dependencies;
}

/**
 * The default pilet requester, which just returns an empty array.
 * Use your own code to connect to the feed service.
 *
 * @example
```js
return fetch('https://feed.piral.cloud/api/v1/pilet/sample')
  .then(res => res.json())
  .then(res => res.items);
```
 */
export function defaultModuleRequester(): Promise<PiletEntries> {
  return Promise.resolve([]);
}
