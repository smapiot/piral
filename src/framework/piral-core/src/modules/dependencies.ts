import { PiletMetadata, AvailableDependencies, isfunc } from 'piral-base';
import { __assign } from 'tslib';

/**
 * The global dependencies, which represent the dependencies
 * shared from the app shell itself.
 */
export const globalDependencies: AvailableDependencies = {};

if (process.env.SHARED_DEPENDENCIES) {
  const fillDependencies = require('../../dependencies.codegen');

  if (isfunc(fillDependencies)) {
    fillDependencies(globalDependencies);
  } else {
    // fall back to the default list if the codegen is invalid / not supported
    __assign(globalDependencies, {
      react: require('react'),
      'react-dom': require('react-dom'),
      'react-router': require('react-router'),
      'react-router-dom': require('react-router-dom'),
      history: require('history'),
      tslib: require('tslib'),
      'path-to-regexp': require('path-to-regexp'),
      '@libre/atom': require('@libre/atom'),
      '@dbeining/react-atom': require('@dbeining/react-atom'),
    });
  }
} else {
  // App shell is built with something else than the Piral CLI - just don't fill ...
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
export function defaultModuleRequester(): Promise<Array<PiletMetadata>> {
  return Promise.resolve([]);
}
