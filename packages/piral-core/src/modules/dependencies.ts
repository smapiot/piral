import { AvailableDependencies } from 'react-arbiter';

export const globalDependencies: AvailableDependencies = {
  react: require('react'),
  'react-router': require('react-router'),
  'react-router-dom': require('react-router-dom'),
  history: require('history'),
  'path-to-regexp': require('path-to-regexp'),
};

export function getLocalDependencies(): AvailableDependencies {
  return {
    'react-arbiter': require('react-arbiter'),
    'react-dom': require('react-dom'),
  };
}
