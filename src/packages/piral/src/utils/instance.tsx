import * as React from 'react';
import { Dashboard } from 'piral-ext';
import {
  Piral,
  SetRoute,
  PiralInstance,
  ComponentsState,
  ErrorComponentsState,
  SetErrors,
  SetLayout,
} from 'piral-core';

export function createInstanceElement(
  instance?: PiralInstance,
  layout?: Partial<ComponentsState>,
  errors?: Partial<ErrorComponentsState>,
): React.ReactElement {
  return (
    <Piral instance={instance}>
      <SetLayout layout={layout} />
      <SetErrors errors={errors} />
      <SetRoute path="/" component={Dashboard} />
    </Piral>
  );
}
