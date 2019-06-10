import { Atom, deref } from '@dbeining/react-atom';
import { destroyFeed, createFeed, loadedFeed, updateFeed, loadFeed } from './feeds';

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

  it('createFeed creates a new feed with the given id', () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
      },
    });
    createFeed.call(state, 'bar');
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: undefined,
          error: undefined,
          loaded: false,
          loading: false,
        },
      },
    });
  });

  it('loadedFeed sets the feed as loaded', () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
      },
    });
    loadedFeed.call(state, 'bar', 'test', 'errror');
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: 'test',
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
  });

  it('updateFeed updates the feed data synchronously', () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9],
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
    updateFeed.call(state, 'bar', 15, (data, item) => [...data, item]);
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9, 15],
          error: undefined,
          loaded: true,
          loading: false,
        },
      },
    });
  });

  it('updateFeed updates the feed data asynchronously', async () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9],
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
    await updateFeed.call(state, 'bar', 15, (data, item) => Promise.resolve([...data, item]));
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9, 15],
          error: undefined,
          loaded: true,
          loading: false,
        },
      },
    });
  });

  it('updateFeed notes the error when updated asynchronously', async () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9],
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
    await updateFeed.call(state, 'bar', 15, (data, item) => Promise.reject('Failed'));
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: undefined,
          error: 'Failed',
          loaded: true,
          loading: false,
        },
      },
    });
  });

  it('loadFeed is responsible for the whole feed lifecycle', async () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9],
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
    let cb = undefined;
    const promise = loadFeed.call(state, {
      id: 'bar',
      initialize() {
        return Promise.resolve([1, 2, 3]);
      },
      connect(update) {
        cb = update;
      },
      update(data, item) {
        return [...data, item];
      },
    });
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: undefined,
          error: undefined,
          loaded: false,
          loading: true,
        },
      },
    });
    await promise;
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [1, 2, 3],
          error: undefined,
          loaded: true,
          loading: false,
        },
      },
    });
    cb(4);
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [1, 2, 3, 4],
          error: undefined,
          loaded: true,
          loading: false,
        },
      },
    });
  });

  it('loadFeed catches any errors', async () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: [9],
          error: 'errror',
          loaded: true,
          loading: false,
        },
      },
    });
    await loadFeed.call(state, {
      id: 'bar',
      initialize() {
        return Promise.reject('error');
      },
      connect() {},
      update() {},
    });
    expect(deref(state)).toEqual({
      foo: 5,
      feeds: {
        foo: 5,
        bar: {
          data: undefined,
          error: 'error',
          loaded: true,
          loading: false,
        },
      },
    });
  });
});
