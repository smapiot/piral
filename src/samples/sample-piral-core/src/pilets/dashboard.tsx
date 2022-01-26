import * as React from 'react';
import { Pilet, PiletApi } from 'piral-core';

/**
 * Shows the possibility of extending default functionality (e.g., the dashboard)
 * with an extension defined by a module.
 */
export const DashboardPilet: Pilet = {
  name: 'Dashboard Module',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  link: '/pilets/connector',
  setup(piral: PiletApi) {
    piral.registerExtension('dashboard', ({ params: { children } }) => <div className="tiles">{children}</div>);
  },
};
