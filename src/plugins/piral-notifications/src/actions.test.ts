import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { openNotification, closeNotification } from './actions';

describe('Notifications Actions Module', () => {
  it('openNotification prepends a new notification', () => {
    const state: any = create(() => ({
      foo: 5,
      notifications: [{ id: 'b' }],
    }));
    const ctx = createActions(state, createListener({}));
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
    const ctx = createActions(state, createListener({}));
    closeNotification(ctx, { id: 'b' });
    expect(state.getState()).toEqual({
      foo: 5,
      notifications: [{ id: 'a' }, { id: 'c' }],
    });
  });
});
