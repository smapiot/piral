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
      <a href="https://smapiot.com/legal/imprint/" target="_blank">
        Imprint
      </a>,
    ),
    attach(
      <a href="https://smapiot.com/legal/privacy/" target="_blank">
        Data Privacy
      </a>,
    ),
    attach(
      <a href="https://smapiot.com/legal/disclaimer/" target="_blank">
        Legal Disclaimer
      </a>,
    ),
  ];
}
