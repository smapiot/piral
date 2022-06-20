import create from 'zustand';
import * as React from 'react';
import { StateContext } from 'piral-core';
import { DefaultErrorInfo } from 'piral-core/lib/defaults/DefaultErrorInfo.js';
import { mount } from 'enzyme';
import './types';

const mockState = {
  state: create(() => ({
    errorComponents: {},
    registry: {
      extensions: {},
    },
  })),
};

(React as any).useMemo = (cb) => cb();

describe('Extended Error Info Component for Forms', () => {
  it('renders the switch-case in the form error case', () => {
    const node = mount(
      <StateContext.Provider value={mockState as any}>
        <DefaultErrorInfo type="form" error="foo" />
      </StateContext.Provider>,
    );
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
  });
});
