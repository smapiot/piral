/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { updateFormState } from './actions';

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
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Forms Actions Module', () => {
  it('updateFormState works on a fresh forms collection', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {},
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, { name: 'Bar' });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {
        a: {
          name: 'Bar',
          active: true,
        },
      },
    });
  });

  it('updateFormState works on an existing forms collection', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, {});
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
          active: true,
        },
      },
    });
  });

  it('updateFormState updates an existing forms collection', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, { name: 'bazeol' });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {
        a: {
          name: 'bazeol',
          active: true,
        },
      },
    });
  });

  it('updateFormState removes an existing forms collection', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo' }, { active: false });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {},
    });
  });

  it('updateFormState does not remove an existing forms collection when submitting', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', submitting: true }, { active: false });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
          submitting: true,
          active: false,
        },
      },
    });
  });

  it('updateFormState does not remove an existing forms collection when changed', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', changed: true }, { submitting: false, active: '' });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
          changed: true,
          submitting: false,
          active: '',
        },
      },
    });
  });

  it('updateFormState does remove an existing forms collection when all false', () => {
    const state: any = create(() => ({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    }));
    const ctx = createActions(state, createListener());
    updateFormState(ctx, 'a', { name: 'Foo', changed: false, active: '' }, { submitting: false });
    expect(state.getState()).toEqual({
      foo: 5,
      forms: {},
    });
  });
});
