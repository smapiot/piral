import 'bootstrap/dist/css/bootstrap.min.css';
import 'piral/polyfills';
import * as React from 'react';
import { render } from 'react-dom';
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
    return fetch('https://feed.piral.cloud/api/v1/pilet/sample')
      .then((res) => res.json())
      .then((res) => res.items);
  },
  state: {
    components: layout,
    errorComponents: errors,
  },
});

render(<Piral instance={instance} />, document.querySelector('#app'));
