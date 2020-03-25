import * as React from 'react';
import { Piral, SetRoute, PiralInstance, ComponentsState, ErrorComponentsState } from 'piral-core';
import { Dashboard } from 'piral-ext';
import { SetErrors, SetLayout } from '../components';

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
