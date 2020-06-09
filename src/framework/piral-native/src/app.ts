import { PiralConfiguration } from 'piral-core';
import { createNativePiral } from './api';
import { createInstanceElement } from './instance';
import { PiralRenderBaseOptions } from './types';

/**
 * Gets a new instantiated native Piral instance using the provided options.
 * @param config The configuration to use when creating the Piral instance.
 * @param options The options to use when rendering the Piral instance.
 * @example
```ts
import { AppRegistry } from 'react-native';
import { getAppInstance } from 'piral-native';

const { app } = getAppInstance();
AppRegistry.registerComponent(appName, () => () => app);
```
 */
export function getAppInstance(config: PiralConfiguration = {}, options: PiralRenderBaseOptions = {}) {
  const { layout, errors } = options;
  const instance = createNativePiral(config);
  const app = createInstanceElement(instance, layout, errors);
  return { instance, app };
}
