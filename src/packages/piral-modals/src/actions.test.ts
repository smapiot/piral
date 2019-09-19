import { Atom, deref } from '@dbeining/react-atom';
import { registerModal, unregisterModal, openModal, closeModal } from './actions';

describe('Modals Actions Module', () => {
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

  it('openModal adds a new modal', () => {
    const state = Atom.of({
      foo: 5,
      modals: ['b'],
    });
    openModal(state, 'a');
    expect(deref(state)).toEqual({
      foo: 5,
      modals: ['a', 'b'],
    });
  });

  it('closeModal removes an existing modal', () => {
    const state = Atom.of({
      foo: 5,
      modals: ['a', 'b', 'c'],
    });
    closeModal(state, 'b');
    expect(deref(state)).toEqual({
      foo: 5,
      modals: ['a', 'c'],
    });
  });
});
