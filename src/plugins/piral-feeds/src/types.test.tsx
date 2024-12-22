/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { StateContext, SwitchErrorInfo } from 'piral-core';
import { render, cleanup } from '@testing-library/react';
import './types';

const FeedErrorInfo = () => <div role="feed_error" />;

const mockState = {
  state: create(() => ({
    errorComponents: {
      feed: FeedErrorInfo,
    },
    registry: {
      extensions: {},
    },
  })),
};

vitest.mock('react', async () => ({
  ...((await vitest.importActual('react')) as any),
  useMemo: (cb) => cb(),
}));

describe('Extended Error Info Component for Feeds', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the switch-case in the feed error case', () => {
    const node = render(
      <StateContext.Provider value={mockState as any}>
        <SwitchErrorInfo type="feed" error="foo" />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('feed_error').length).toBe(1);
  });
});
