import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { updateFormState } from './actions';

describe('Forms Actions Module', () => {
  it('updateFormState works on a fresh forms collection', () => {
    const state = Atom.of({
      foo: 5,
      forms: {},
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, { name: 'Bar' });
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, {});
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', active: true }, { name: 'bazeol' });
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo' }, { active: false });
    expect(deref(state)).toEqual({
      foo: 5,
      forms: {},
    });
  });

  it('updateFormState does not remove an existing forms collection when submitting', () => {
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', submitting: true }, { active: false });
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', changed: true }, { submitting: false, active: '' });
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      forms: {
        a: {
          name: 'Baz',
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    updateFormState(ctx, 'a', { name: 'Foo', changed: false, active: '' }, { submitting: false });
    expect(deref(state)).toEqual({
      foo: 5,
      forms: {},
    });
  });
});
