import * as React from 'react';
import * as piralCore from 'piral-core';
import { mount } from 'enzyme';
import './types';

jest.mock('piral-core/lib/hooks/globalState', () => ({
  useGlobalState(s) {
    return s({
      registry: {
        extensions: {},
      },
      errorComponents: {},
    });
  },
}));

(React as any).useMemo = cb => cb();

describe('Extended Error Info Component for Forms', () => {
  it('renders the switch-case in the form error case', () => {
    const { DefaultErrorInfo } = piralCore;
    const node = mount(<DefaultErrorInfo type="form" error="foo" />);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });
});
