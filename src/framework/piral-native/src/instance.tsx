import * as React from 'react';
import { Piral, PiralInstance, ComponentsState, ErrorComponentsState, SetErrors, SetLayout } from 'piral-core';

export function createInstanceElement(
  instance?: PiralInstance,
  layout?: Partial<ComponentsState>,
  errors?: Partial<ErrorComponentsState>,
): React.ReactElement {
  return (
    <Piral instance={instance}>
      <SetLayout layout={layout} />
      <SetErrors errors={errors} />
    </Piral>
  );
}
