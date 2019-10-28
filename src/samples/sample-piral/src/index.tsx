import 'bootstrap/dist/css/bootstrap.min.css';
import { renderInstance, getUserLocale, setupLocalizer, setupGqlClient } from 'piral';
import { createAuthApi } from 'piral-auth';
import { createSearchApi } from 'piral-search';
import { setupFooter, setupMenu } from './parts';
import { layout, errors } from './layout';

renderInstance({
  settings: {
    gql: setupGqlClient({
      subscriptionUrl: false,
    }),
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
    return fetch('https://feed.piral.io/api/v1/pilet/sample')
      .then(res => res.json())
      .then(res => res.items);
  },
  layout,
  errors,
});

export * from 'piral';
