import * as React from 'react';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { showPortal, destroyPortal, hidePortal, updatePortal } from './portal';

describe('Piral-Core portal actions', () => {
  it('destroyPortal removes a portal', () => {
    const children = React.createElement('div');
    const portal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };

    const state = Atom.of({
      portals: { test: { portal } },
    });

    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
    };

    destroyPortal(ctx, 'test');
    const { portals } = deref(ctx.state);
    expect(portals).not.toBeNull();
    expect(portals.test).toBeUndefined();
  });

  it('hidePortal hides a portal', () => {
    const children = React.createElement('div');
    const newPortal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = Atom.of({
      portals: { p1: { portal } },
    });

    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
    };

    hidePortal(ctx, 'test', newPortal);
    const { portals } = deref(ctx.state);
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });

  it('updatePortal updates a portal', () => {
    const children = React.createElement('div');
    const current: React.ReactPortal = { key: 'current', children: { children }, type: 'div', props: null };
    const next: React.ReactPortal = { key: 'next', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = Atom.of({
      portals: { p1: { portal } },
    });

    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
    };

    updatePortal(ctx, 'test', current, next);
    const { portals } = deref(ctx.state);
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });

  it('showPortal adds a portal', () => {
    const children = React.createElement('div');
    const newPortal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = Atom.of({
      portals: { p1: { portal } },
    });

    const ctx: any = {
      state,
      dispatch(update) {
        swap(state, update);
      },
    };

    showPortal(ctx, 'test', newPortal);
    const { portals } = deref(ctx.state);
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });
});
