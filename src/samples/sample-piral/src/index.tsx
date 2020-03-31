import 'bootstrap/dist/css/bootstrap.min.css';
import 'piral/polyfills';
import { renderInstance, getUserLocale, setupLocalizer } from 'piral';
import { createAuthApi } from 'piral-auth';
import { createSearchApi } from 'piral-search';
import { setupFooter, setupMenu } from './parts';
import { layout, errors } from './layout';

renderInstance({
  settings: {
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
  },
  extendApi: [createAuthApi(), createSearchApi()],
  requestPilets() {
    return fetch('https://feed.piral.cloud/api/v1/pilet/sample')
      .then(res => res.json())
      .then(res => res.items);
  },
  layout,
  errors,
});
