import * as React from 'react';
import { render } from 'react-dom';
import { Piral, SetComponent, SetError, SetRoute } from 'piral-core';
import { Dashboard } from 'piral-ext';
import { createPiral } from './api';
import { getContainer } from './utils';
import { PiralRenderOptions } from './types';

/**
 * Sets up a new Piral instance and renders it using the provided options.
 * Can be used as simple as calling the function directly without any
 * arguments.
 * @param options The options to use when setting up the Piral instance.
 * @example
```tsx
import { renderInstance } from 'piral';
renderInstance();
export * from 'piral';
```
 */
export function renderInstance(options: PiralRenderOptions = {}) {
  const { selector = '#app', settings, layout = {}, errors = {}, ...config } = options;
  const instance = createPiral(config, settings);
  const app = (
    <Piral instance={instance}>
      {Object.keys(layout).map((key: any) => (
        <SetComponent name={key} component={layout[key]} key={key} />
      ))}
      {Object.keys(errors).map((key: any) => (
        <SetError type={key} component={errors[key]} key={key} />
      ))}
      <SetRoute path="/" component={Dashboard} />
    </Piral>
  );

  render(app, getContainer(selector));
  return instance;
}
