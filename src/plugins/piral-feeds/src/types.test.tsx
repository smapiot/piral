import * as React from 'react';
import { Atom } from '@dbeining/react-atom';
import { StateContext } from 'piral-core';
import { DefaultErrorInfo } from 'piral-core/lib/defaults/DefaultErrorInfo.js';
import { mount } from 'enzyme';
import './types';

const mockState = {
  state: Atom.of({
    errorComponents: {},
    registry: {
      extensions: {},
    },
  }),
};

(React as any).useMemo = (cb) => cb();

describe('Extended Error Info Component for Feeds', () => {
  it('renders the switch-case in the feed error case', () => {
    const node = mount(
      <StateContext.Provider value={mockState as any}>
        <DefaultErrorInfo type="feed" error="foo" />
      </StateContext.Provider>,
    );
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
  });
});
