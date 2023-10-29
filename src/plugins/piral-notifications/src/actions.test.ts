/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { openNotification, closeNotification } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  const obj = {
    ...listener,
    state: state.getState(),
    defineActions(actions) {
      Object.entries(actions).forEach(([name, cb]) => {
        obj[name] = (cb as any).bind(obj, obj);
      });
    },
    readState(select) {
      return select(state.getState());
    },
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
  return obj;
}

describe('Notifications Actions Module', () => {
  it('openNotification prepends a new notification', () => {
    const state: any = create(() => ({
      foo: 5,
      notifications: [{ id: 'b' }],
    }));
    const ctx = createActions(state, createListener());
    openNotification(ctx, { id: 'a' });
    expect(state.getState()).toEqual({
      foo: 5,
      notifications: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('closeNotification removes an existing notification', () => {
    const state: any = create(() => ({
      foo: 5,
      notifications: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    }));
    const ctx = createActions(state, createListener());
    closeNotification(ctx, { id: 'b' });
    expect(state.getState()).toEqual({
      foo: 5,
      notifications: [{ id: 'a' }, { id: 'c' }],
    });
  });
});
