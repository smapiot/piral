import { AvailableDependencies, isfunc } from 'react-arbiter';

const sharedDependencies: AvailableDependencies = {};

if (process.env.SHARED_DEPENDENCIES) {
  const fillDependencies = require(process.env.SHARED_DEPENDENCIES);

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

// change getDependencies to only add dependencies
