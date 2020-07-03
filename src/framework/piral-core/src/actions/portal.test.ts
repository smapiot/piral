import * as React from 'react';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { showPortal, destroyPortal } from './portal';

describe('Piral-Core portal actions', () => {
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
});
