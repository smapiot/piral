import { Atom, deref } from '@dbeining/react-atom';
import {
  registerExtension,
  registerMenuItem,
  registerModal,
  registerPage,
  registerSearchProvider,
  registerTile,
  unregisterExtension,
  unregisterMenuItem,
  unregisterModal,
  unregisterPage,
  unregisterSearchProvider,
  unregisterTile,
} from './components';

describe('Components Actions Module', () => {
  it('registerExtension and unregisterExtension', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        extensions: {},
      },
    });
    registerExtension(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        extensions: {
          foo: [10],
        },
      },
    });
    unregisterExtension(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        extensions: {
          foo: [],
        },
      },
    });
  });

  it('registerMenuItem and unregisterMenuItem', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        menuItems: {},
      },
    });
    registerMenuItem(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        menuItems: {
          foo: 10,
        },
      },
    });
    unregisterMenuItem(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        menuItems: {},
      },
    });
  });

  it('registerModal and unregisterModal', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        modals: {},
      },
    });
    registerModal(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        modals: {
          foo: 10,
        },
      },
    });
    unregisterModal(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        modals: {},
      },
    });
  });

  it('registerPage and unregisterPage', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        pages: {},
      },
    });
    registerPage(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        pages: {
          foo: 10,
        },
      },
    });
    unregisterPage(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        pages: {},
      },
    });
  });

  it('registerSearchProvider and unregisterSearchProvider', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {},
      },
    });
    registerSearchProvider(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {
          foo: 10,
        },
      },
    });
    unregisterSearchProvider(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {},
      },
    });
  });

  it('registerTile and unregisterTile', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        tiles: {},
      },
    });
    registerTile(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        tiles: {
          foo: 10,
        },
      },
    });
    unregisterTile(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        tiles: {},
      },
    });
  });
});
