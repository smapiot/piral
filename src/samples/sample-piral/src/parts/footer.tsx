import * as React from 'react';
import { PiletApi } from 'piral';

function attachFooter() {
  let count = 0;

  return (api: PiletApi, element: React.ReactElement) => {
    api.registerMenu(`footer_${count++}`, () => element, { type: 'footer' });
  };
}

const attach = attachFooter();

export function setupFooter(api: PiletApi) {
  attach(
    api,
    <a href="https://smapiot.com/legal/imprint/" target="_blank">
      Imprint
    </a>,
  );
  attach(
    api,
    <a href="https://smapiot.com/legal/privacy/" target="_blank">
      Data Privacy
    </a>,
  );
  attach(
    api,
    <a href="https://smapiot.com/legal/disclaimer/" target="_blank">
      Legal Disclaimer
    </a>,
  );
}
