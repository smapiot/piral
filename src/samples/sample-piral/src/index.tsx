import { renderInstance } from 'piral';
import { MenuToggle, User } from './components';
import { setupFooter, setupMenu } from './parts';

renderInstance({
  subscriptionUrl: false,
  components: {
    MenuToggle,
    User,
  },
  attach(api) {
    setupFooter(api);
    setupMenu(api);
  },
});

export * from 'piral';
