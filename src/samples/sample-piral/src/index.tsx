import { renderInstance } from 'piral';
import { setupFooter, setupMenu } from './parts';
import { layout } from './layout';

renderInstance({
  subscriptionUrl: false,
  attach(api) {
    setupFooter(api);
    setupMenu(api);
  },
  layout,
  requestPilets: () =>
    fetch('https://sample.piral.io/api/v1/pilet')
      .then(res => res.json())
      .then(res => res.items),
});

export * from 'piral';
