import { Atom, deref } from '@dbeining/react-atom';
import { openModal, closeModal } from './modals';

describe('Modals Actions Module', () => {
  it('openModal adds a new modal', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        bar: 5,
        modals: ['b'],
      },
    });
    openModal.call(state, 'a');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        bar: 5,
        modals: ['a', 'b'],
      },
    });
  });

  it('closeModal removes an existing modal', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        bar: 5,
        modals: ['a', 'b', 'c'],
      },
    });
    closeModal.call(state, 'b');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        bar: 5,
        modals: ['a', 'c'],
      },
    });
  });
});
