import * as React from 'react';
import { ComponentsState, SetComponent } from 'piral-core';

export interface SetLayoutProps {
  /**
   * The layout of the Piral instance.
   */
  layout?: Partial<ComponentsState>;
}

export function SetLayout({ layout = {} }: SetLayoutProps): React.ReactElement {
  return (
    <>
      {Object.keys(layout).map((key: any) => (
        <SetComponent name={key} component={layout[key]} key={key} />
      ))}
    </>
  );
}
