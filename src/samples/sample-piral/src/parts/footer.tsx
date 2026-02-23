import * as React from 'react';
import { InitialMenuItem } from 'piral';

function attach(element: React.ReactElement): InitialMenuItem {
  return {
    settings: {
      type: 'footer',
    },
    component: () => element,
  };
}

export function setupFooter() {
  return [
    attach(
      <a href="https://www.smapiot.com/en/legal-notice/" target="_blank">
        Imprint
      </a>,
    ),
    attach(
      <a href="https://docs.piral.io" target="_blank">
        Piral Documentation
      </a>,
    ),
    attach(
      <a href="https://www.piral.cloud" target="_blank">
        Piral Cloud Feed Service
      </a>,
    ),
  ];
}
