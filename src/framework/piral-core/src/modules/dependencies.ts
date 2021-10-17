import { PiletMetadata, AvailableDependencies, isfunc } from 'piral-base';

/**
 * The global dependencies, which represent the dependencies
 * shared from the app shell itself.
 */
export const globalDependencies: AvailableDependencies = {
  react: require('react'),
  'react-dom': require('react-dom'),
  'react-router': require('react-router'),
  'react-router-dom': require('react-router-dom'),
  history: require('history'),
  tslib: require('tslib'),
  'path-to-regexp': require('path-to-regexp'),
  '@libre/atom': require('@libre/atom'),
  '@dbeining/react-atom': require('@dbeining/react-atom'),
};

if (process.env.SHARED_DEPENDENCIES) {
  const fillDependencies = require('../../dependencies.codegen');

  if (isfunc(fillDependencies)) {
    fillDependencies(globalDependencies);
  }
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
