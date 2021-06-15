import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerModal, unregisterModal, openModal, closeModal } from './actions';

describe('Modals Actions Module', () => {
  it('registerModal and unregisterModal', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        modals: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    registerModal(ctx, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        modals: {
          foo: 10,
        },
      },
    });
    unregisterModal(ctx, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        modals: {},
      },
    });
  });

  it('openModal adds a new modal', () => {
    const state = Atom.of({
      foo: 5,
      modals: [{ id: 'b' }],
    });
    const ctx = createActions(state, createListener({}));
    openModal(ctx, { id: 'a' });
    expect(deref(state)).toEqual({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('closeModal removes an existing modal', () => {
    const state = Atom.of({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    });
    const ctx = createActions(state, createListener({}));
    closeModal(ctx, { id: 'b' });
    expect(deref(state)).toEqual({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'c' }],
    });
  });
});
