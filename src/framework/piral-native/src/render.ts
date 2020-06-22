import { AppRegistry } from 'react-native';
import { getAppInstance } from './app';
import { PiralRenderOptions } from './types';

function noChange<T>(config: T) {
  return config;
}

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param appName The name of the application.
 * @param options The options to use when setting up the Piral instance.
 * @example
```ts
import { renderInstance } from 'piral-native';
renderInstance();
```
 */
export function renderInstance(appName: string, options?: PiralRenderOptions) {
  const { layout, errors, middleware = noChange, ...config } = options;
  const { app, instance } = getAppInstance(middleware(config), { layout, errors });
  const App = () => app;
  AppRegistry.registerComponent(appName, () => App);
  return instance;
}
