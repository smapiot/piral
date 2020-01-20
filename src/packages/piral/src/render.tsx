import { render } from 'react-dom';
import { createPiral } from './api';
import { getContainer, createInstanceElement } from './utils';
import { PiralRenderOptions } from './types';

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param options The options to use when setting up the Piral instance.
 * @example
```jsx
import { renderInstance } from 'piral';
renderInstance();
```
 */
export function renderInstance(options: PiralRenderOptions = {}) {
  const { selector = '#app', settings, layout, errors, ...config } = options;
  const instance = createPiral(config, settings);
  const app = createInstanceElement(instance, layout, errors);
  render(app, getContainer(selector));
  return instance;
}
