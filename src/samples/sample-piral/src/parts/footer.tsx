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
    <a href="https://www.smapiot.com/en/imprint/" target="_blank">
      Imprint
    </a>,
  );
  attach(
    api,
    <a href="https://www.smapiot.com/en/dataprivacy/" target="_blank">
      Data Privacy
    </a>,
  );
  attach(
    api,
    <a href="https://www.smapiot.com/en/disclaimer/" target="_blank">
      Legal Disclaimer
    </a>,
  );
}
