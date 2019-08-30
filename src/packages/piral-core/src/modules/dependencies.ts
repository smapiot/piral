import { AvailableDependencies, isfunc } from 'react-arbiter';

const sharedDependencies: AvailableDependencies = {};

if (process.env.SHARED_DEPENDENCIES) {
  const fillDependencies = require('piral-cli/lib/shared-dependencies');

  if (isfunc(fillDependencies)) {
    fillDependencies(sharedDependencies);
  }
}

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

export function getLocalDependencies(): AvailableDependencies {
  return {
    ...globalDependencies,
    ...sharedDependencies,
  };
}
