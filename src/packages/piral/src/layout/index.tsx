import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { rehydrate } from './rehydrate';
import { vitalize } from './vitalize';

export function getLayout(): React.SFC {
  const elements = rehydrate(document.querySelector('template[for=layout]'));

  return ({ children }) => {
    const components = useGlobalState(m => m.app.components);
    const layout = vitalize(elements, children, components);
    return <>{layout}</>;
  };
}
