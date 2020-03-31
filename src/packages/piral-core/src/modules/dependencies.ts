import { PiletMetadata, AvailableDependencies, isfunc } from 'piral-base';

const sharedDependencies: AvailableDependencies = {};

if (process.env.SHARED_DEPENDENCIES) {
  const fillDependencies = require('../../dependencies.codegen');

  if (isfunc(fillDependencies)) {
    fillDependencies(sharedDependencies);
  }
}

/**
 * The global dependencies, which represent the dependencies
 * already used by piral-core itself.
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

/**
 * Gets the local dependencies for the app shell, which
 * are the global dependencies and the implicitly shared
 * dependencies.
 */
export function getLocalDependencies(): AvailableDependencies {
  return {
    ...globalDependencies,
    ...sharedDependencies,
  };
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
