import 'bootstrap/dist/css/bootstrap.min.css';
import { renderInstance } from 'piral';
import { setupFooter, setupMenu } from './parts';
import { layout } from './layout';

renderInstance({
  settings: {
    gql: {
      subscriptionUrl: false,
    },
    locale: {
      messages: {
        de: {},
        en: {},
      },
    },
    menu: {
      items: [...setupMenu(), ...setupFooter()],
    },
  },
  requestPilets() {
    return fetch('https://feed.piral.io/api/v1/pilet/sample')
      .then(res => res.json())
      .then(res => res.items);
  },
  layout,
});

export * from 'piral';
