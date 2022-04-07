import * as React from 'react';
import { DefaultErrorInfo } from 'piral-core/src/defaults';
import { mount } from 'enzyme';
import './types';

jest.mock('piral-core/src/hooks/globalState', () => ({
  useGlobalState() {
    return [];
  },
}));

(React as any).useMemo = (cb) => cb();

describe('Extended Error Info Component for Forms', () => {
  it('renders the switch-case in the form error case', () => {
    const node = mount(<DefaultErrorInfo type="form" error="foo" />);
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
  });
});
