import { AvailableDependencies } from 'react-arbiter';

const sharedDependencies = (process.env.SHARED_DEPENDENCIES || '').split(',').reduce(
  (depMap, dependency) => {
    if (dependency) {
      depMap[dependency] = require(dependency);
    }

    return depMap;
  },
  {} as AvailableDependencies,
);

export const globalDependencies: AvailableDependencies = {
  react: require('react'),
  'react-router': require('react-router'),
  'react-router-dom': require('react-router-dom'),
  history: require('history'),
  'path-to-regexp': require('path-to-regexp'),
};

export function getLocalDependencies(): AvailableDependencies {
  return {
    ...globalDependencies,
    ...sharedDependencies,
  };
}
