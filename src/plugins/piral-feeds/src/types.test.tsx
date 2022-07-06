import * as React from 'react';
import create from 'zustand';
import { StateContext } from 'piral-core';
import { DefaultErrorInfo } from 'piral-core/lib/defaults/DefaultErrorInfo.js';
import { render } from '@testing-library/react';
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

(React as any).useMemo = (cb) => cb();

describe('Extended Error Info Component for Feeds', () => {
  it('renders the switch-case in the feed error case', () => {
    const node = render(
      <StateContext.Provider value={mockState as any}>
        <DefaultErrorInfo type="feed" error="foo" />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('feed_error').length).toBe(1);
  });
});
