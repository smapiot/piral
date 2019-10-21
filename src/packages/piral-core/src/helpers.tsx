import { AvailableDependencies } from 'react-arbiter';
import { globalDependencies, getLocalDependencies } from './modules';

/**
 * Creates a dependency getter that sets the shared dependencies explicitly.
 * Overrides the potentially set shared dependencies from the Piral CLI, but
 * keeps all global dependencies such as react, react-dom, ...
 * @param sharedDependencies The shared dependencies to declare.
 */
export function setSharedDependencies(sharedDependencies: AvailableDependencies) {
  const dependencies = {
    ...globalDependencies,
    ...sharedDependencies,
  };
  return () => dependencies;
}

/**
 * Creates a dependency getter that extends the shared dependencies with additional dependencies.
 * @param additionalDependencies The additional dependencies to declare.
 */
export function extendSharedDependencies(additionalDependencies: AvailableDependencies) {
  const dependencies = {
    ...getLocalDependencies(),
    ...additionalDependencies,
  };
  return () => dependencies;
}
