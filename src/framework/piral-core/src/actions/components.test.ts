import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { registerExtension, registerPage, unregisterExtension, unregisterPage } from './components';
import { createActions } from '../state';

describe('Components Actions Module', () => {
  it('registerExtension and unregisterExtension', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    registerExtension(ctx, 'foo', 10 as any);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {
          foo: [10],
        },
      },
    });
    unregisterExtension(ctx, 'foo');
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
    const ctx = createActions(state, createListener({}));
    registerPage(ctx, 'foo', 10 as any);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {
          foo: 10,
        },
      },
    });
    unregisterPage(ctx, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {},
      },
    });
  });
});
