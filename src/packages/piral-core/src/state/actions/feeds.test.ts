import { Atom, deref } from '@dbeining/react-atom';
import { destroyFeed } from './feeds';

describe('Feeds Actions Module', () => {
  it('destroyFeed removes the feed with the given id', () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: 10,
      },
    });
    destroyFeed.call(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        bar: 10,
      },
    });
  });
});
