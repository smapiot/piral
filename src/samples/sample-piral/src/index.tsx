import { renderInstance } from 'piral';
import { setupFooter, setupMenu } from './parts';
import { layout } from './layout';

renderInstance({
  subscriptionUrl: false,
  layout,
  config: {
    translations: ['en', 'de'],
    attach(api) {
      setupFooter(api);
      setupMenu(api);
    },
    pilets: () =>
      fetch('https://feed.piral.io/api/v1/pilet/sample')
        .then(res => res.json())
        .then(res => res.items),
  },
});

export * from 'piral';
