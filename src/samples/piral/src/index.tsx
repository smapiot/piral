import { renderInstance } from 'piral';
import { MenuToggle, User } from './components';

renderInstance({
  gateway: 'https://sample.piral.io',
  components: {
    MenuToggle,
    User,
  },
});

export * from 'piral';
