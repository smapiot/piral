import { Atom, deref } from '@dbeining/react-atom';
import { registerExtension, registerPage, unregisterExtension, unregisterPage } from './components';

describe('Components Actions Module', () => {
  it('registerExtension and unregisterExtension', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {},
      },
    });
    registerExtension(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {
          foo: [10],
        },
      },
    });
    unregisterExtension(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {
          foo: [],
        },
      },
    });
  });

  it('registerPage and unregisterPage', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        pages: {},
      },
    });
    registerPage(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {
          foo: 10,
        },
      },
    });
    unregisterPage(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {},
      },
    });
  });
});
