/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerModal, unregisterModal, openModal, closeModal } from './actions';

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

describe('Modals Actions Module', () => {
  it('registerModal and unregisterModal', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        modals: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerModal(ctx, 'foo', 10);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        modals: {
          foo: 10,
        },
      },
    });
    unregisterModal(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        modals: {},
      },
    });
  });

  it('openModal adds a new modal', () => {
    const state: any = create(() => ({
      foo: 5,
      modals: [{ id: 'b' }],
    }));
    const ctx = createActions(state, createListener({}));
    openModal(ctx, { id: 'a' });
    expect(state.getState()).toEqual({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('closeModal removes an existing modal', () => {
    const state: any = create(() => ({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    }));
    const ctx = createActions(state, createListener({}));
    closeModal(ctx, { id: 'b' });
    expect(state.getState()).toEqual({
      foo: 5,
      modals: [{ id: 'a' }, { id: 'c' }],
    });
  });
});
