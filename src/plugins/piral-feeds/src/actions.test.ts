/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { destroyFeed, createFeed, loadedFeed, updateFeed, loadFeed } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  return {
    ...listener,
    state: state.getState(),
    readState(select) {
      return select(state.getState());
    },
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Feeds Actions Module', () => {
  it('destroyFeed removes the feed with the given id', () => {
    const state: any = create(() => ({
      foo: 5,
      feeds: {
        foo: 5,
        bar: 10,
      },
    }));
    const ctx = createActions(state, createListener());
    destroyFeed(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      feeds: {
        bar: 10,
      },
    });
  });

  it('createFeed creates a new feed with the given id', () => {
    const state: any = create(() => ({
      foo: 5,
      feeds: {
        foo: 5,
      },
    }));
    const ctx = createActions(state, createListener());
    createFeed(ctx, 'bar');
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
      foo: 5,
      feeds: {
        foo: 5,
      },
    }));
    const ctx = createActions(state, createListener());
    loadedFeed(ctx, 'bar', 'test', 'errror');
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
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
    }));
    const ctx = createActions(state, createListener());
    updateFeed(ctx, 'bar', 15, (data, item) => [...data, item]);
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
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
    }));
    const ctx = createActions(state, createListener());
    await updateFeed(ctx, 'bar', 15, (data, item) => Promise.resolve([...data, item]));
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
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
    }));
    const ctx = createActions(state, createListener());
    await updateFeed(ctx, 'bar', 15, () => Promise.reject('Failed'));
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
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
    }));
    let cb = undefined;
    const ctx = createActions(state, createListener());
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
    expect(state.getState()).toEqual({
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
    expect(state.getState()).toEqual({
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
    expect(state.getState()).toEqual({
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
    const state: any = create(() => ({
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
    }));
    const ctx = createActions(state, createListener());
    await loadFeed(ctx, {
      id: 'bar',
      initialize() {
        return Promise.reject('error');
      },
      connect() {},
      update() {},
    });
    expect(state.getState()).toEqual({
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
