import * as React from 'react';
import { Pilet } from 'piral-core';

/**
 * Shows the possibility of extending default functionality (e.g., the dashboard)
 * with an extension defined by a module.
 */
export const DashboardPilet: Pilet = {
  content: '',
  name: 'Dashboard Module',
  version: '1.0.0',
  hash: '3',
  setup(piral) {
    piral.registerExtension('dashboard', ({ params: { children } }) => (
      <div className="tiles">{children}</div>
    ));
  },
};
