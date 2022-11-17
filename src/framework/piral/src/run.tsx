import { getAppInstance } from './app';
import { PiralRenderOptions, PiralRunner } from './types';

function noChange<T>(config: T) {
  return config;
}

/**
 * Sets up a new Piral instance and runs it using the provided runner.
 * @param options The options to use when setting up the Piral instance.
 * @deprecated Use `createInstance` with `render` or `hydrate` directly.
 * @example
```ts
import { render } from 'react-dom';
import { runInstance } from 'piral';

runInstance((app, selector) => render(app, document.querySelector(selector)));
```
 */
export function runInstance(runner: PiralRunner, options: PiralRenderOptions = {}) {
  const {
    selector = '#app',
    settings,
    layout,
    piralChildren,
    dashboardPath,
    errors,
    middleware = noChange,
    ...config
  } = options;
  const { app, instance } = getAppInstance(middleware(config), {
    settings,
    layout,
    errors,
    dashboardPath,
    piralChildren,
  });
  runner(app, selector);
  return instance;
}
