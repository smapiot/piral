import { renderToString } from 'react-dom/server';
import { createPiral } from './api';
import { createInstanceElement } from './utils';
import { PiralRenderBaseOptions } from './types';

/**
 * Renders a new Piral instance with react-id attributes using the provided options.
 * Can be used as simple as calling the function directly without any arguments.
 * @param options The options to use when stringifying the Piral instance.
 * @example
```tsx
import { stringifyInstance } from 'piral/lib/server';
const html = stringifyInstance();
```
 */
export function stringifyInstance(options: PiralRenderBaseOptions = {}) {
  const { settings, layout, errors, ...config } = options;
  const instance = createPiral(config, settings);
  const app = createInstanceElement(instance, layout, errors);
  return renderToString(app);
}
