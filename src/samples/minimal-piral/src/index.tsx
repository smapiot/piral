import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, Piral } from 'piral-core';

const instance = createInstance({
  plugins: [],
  state: {},
  requestPilets() {
    return Promise.resolve([]);
  },
});

createRoot(document.querySelector('#app')).render(<Piral instance={instance} />);
