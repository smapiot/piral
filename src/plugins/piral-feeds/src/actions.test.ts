import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { destroyFeed, createFeed, loadedFeed, updateFeed, loadFeed } from './actions';

describe('Feeds Actions Module', () => {
  it('destroyFeed removes the feed with the given id', () => {
    const state = Atom.of({
      foo: 5,
      feeds: {
        foo: 5,
        bar: 10,
      },
    });
    const ctx = createActions(state, createListener({}));
    destroyFeed(ctx, 'foo');
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
    const ctx = createActions(state, createListener({}));
    createFeed(ctx, 'bar');
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
    const ctx = createActions(state, createListener({}));
    loadedFeed(ctx, 'bar', 'test', 'errror');
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
    const ctx = createActions(state, createListener({}));
    updateFeed(ctx, 'bar', 15, (data, item) => [...data, item]);
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
    const ctx = createActions(state, createListener({}));
    await updateFeed(ctx, 'bar', 15, (data, item) => Promise.resolve([...data, item]));
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
    const ctx = createActions(state, createListener({}));
    await updateFeed(ctx, 'bar', 15, () => Promise.reject('Failed'));
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
    const ctx = createActions(state, createListener({}));
    const promise = loadFeed(ctx, {
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
    const ctx = createActions(state, createListener({}));
    await loadFeed(ctx, {
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
