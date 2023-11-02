import * as React from 'react';
import create from 'zustand';
import { describe, it, expect } from 'vitest';
import { showPortal, destroyPortal, hidePortal, updatePortal } from './portal';

describe('Piral-Core portal actions', () => {
  it('destroyPortal removes a portal', () => {
    const children = React.createElement('div');
    const portal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };

    const state = create(() => ({
      portals: { test: { portal } },
    }));

    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    };

    destroyPortal(ctx, 'test');
    const { portals } = ctx.state.getState();
    expect(portals).not.toBeNull();
    expect(portals.test).toBeUndefined();
  });

  it('hidePortal hides a portal', () => {
    const children = React.createElement('div');
    const newPortal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = create(() => ({
      portals: { p1: { portal } },
    }));

    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    };

    hidePortal(ctx, 'test', newPortal);
    const { portals } = ctx.state.getState();
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });

  it('updatePortal updates a portal', () => {
    const children = React.createElement('div');
    const current: React.ReactPortal = { key: 'current', children: { children }, type: 'div', props: null };
    const next: React.ReactPortal = { key: 'next', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = create(() => ({
      portals: { p1: { portal } },
    }));

    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    };

    updatePortal(ctx, 'test', current, next);
    const { portals } = ctx.state.getState();
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });

  it('showPortal adds a portal', () => {
    const children = React.createElement('div');
    const newPortal: React.ReactPortal = { key: 'test', children: { children }, type: 'div', props: null };
    const portal: React.ReactPortal = { key: 'toast', children: { children }, type: 'div', props: null };

    const state = create(() => ({
      portals: { p1: { portal } },
    }));

    const ctx: any = {
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    };

    showPortal(ctx, 'test', newPortal);
    const { portals } = ctx.state.getState();
    expect(portals).not.toBeNull();
    expect(portals.test).not.toBeNull();
  });
});
