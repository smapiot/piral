import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInstance, createStandardApi, getUserLocale, Piral, setupLocalizer } from 'piral';
import { createAuthApi } from 'piral-auth';
import { createSearchApi } from 'piral-search';
import { setupFooter, setupMenu } from './parts';
import { layout, errors } from './layout';

const instance = createInstance({
  plugins: [
    createAuthApi(),
    createSearchApi(),
    ...createStandardApi({
      locale: setupLocalizer({
        language: getUserLocale,
        messages: {
          de: {},
          en: {},
        },
      }),
      menu: {
        items: [...setupMenu(), ...setupFooter()],
      },
    }),
  ],
  requestPilets() {
    return Promise.resolve([{
      spec: 'mf',
      name: '@wmf/foo',
      version: '1.0.0',
      link: 'http://localhost:8080/index.js',
    }]);
    return fetch('https://feed.piral.cloud/api/v1/pilet/sample')
      .then((res) => res.json())
      .then((res) => res.items);
  },
  state: {
    components: layout,
    errorComponents: errors,
  },
});

const root = createRoot(document.querySelector('#app'));
root.render(<Piral instance={instance} />);


