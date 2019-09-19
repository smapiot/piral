import { Atom, deref } from '@dbeining/react-atom';
import { registerTile, unregisterTile } from './actions';

describe('Dashboard Actions Module', () => {
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
