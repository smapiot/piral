/**
 * @vitest-environment node
 */

import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { renderElement } from './element';

vitest.mock('../../app.codegen', () => ({
  createNavigation: vitest.fn((publicPath) => ({
    publicPath,
  })),
  publicPath: '/',
}));

function createMockContext(): [any, any] {
  const state: any = create(() => ({
    portals: {
      root: [],
    },
  }));
  const context = createActions(state, createListener({}));
  return [context, state];
}

describe('Elements Module from SSR', () => {
  it('Should not have piral-extensions web component', () => {
    const [context, state] = createMockContext();
    const element: any = {
      addEventListener() {},
    };
    renderElement(context, element, {});
    expect(state.getState().portals.root.length).toBe(0);
  });
});
