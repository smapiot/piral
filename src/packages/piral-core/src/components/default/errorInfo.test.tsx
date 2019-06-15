import * as React from 'react';
import { mount } from 'enzyme';
import { DefaultErrorInfo } from './errorInfo';

jest.mock('../../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
}));

const state = {
  components: {
    extensions: {},
  },
};

(React as any).useMemo = cb => cb();

const StubErrorInfo: React.SFC = props => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

describe('Default Error Info Component', () => {
  it('renders the switch-case in the feed error case', () => {
    const node = mount(<DefaultErrorInfo type="feed" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the switch-case in the form error case', () => {
    const node = mount(<DefaultErrorInfo type="form" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the switch-case in the loading error case', () => {
    const node = mount(<DefaultErrorInfo type="loading" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the switch-case in the not_found error case', () => {
    const node = mount(
      <DefaultErrorInfo
        type="not_found"
        history={undefined}
        match={undefined}
        location={{ pathname: 'foo', hash: '', key: '', search: '', state: '' }}
      />,
    );
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the switch-case in the page error case', () => {
    const node = mount(
      <DefaultErrorInfo
        type="page"
        history={undefined}
        match={undefined}
        location={{ pathname: 'bar', hash: '', key: '', search: '', state: '' }}
      />,
    );
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the react fragment in the default case', () => {
      (state.components.extensions as any).error = [
      {
        component: StubErrorInfo,
      },
    ];
    const node = mount(<DefaultErrorInfo type="feed" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.findWhere(n => n.key() === 'default_error').length).toBe(0);
  });
});
