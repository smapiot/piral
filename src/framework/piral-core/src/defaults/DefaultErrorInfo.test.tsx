import * as React from 'react';
import { mount } from 'enzyme';
import { DefaultErrorInfo } from './DefaultErrorInfo';

jest.mock('../hooks/globalState', () => ({
  useGlobalState(select: any) {
    return select(state);
  },
}));

const state = {
  registry: {
    extensions: {},
  },
  errorComponents: {},
};

const StubErrorInfo: React.FC = (props) => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

describe('Default Error Info Component', () => {
  it('renders the switch-case in the loading error case', () => {
    const node = mount(<DefaultErrorInfo type="loading" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
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
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the switch-case in the page error case', () => {
    const node = mount(
      <DefaultErrorInfo
        error={undefined}
        type="page"
        history={undefined}
        match={undefined}
        location={{ pathname: 'bar', hash: '', key: '', search: '', state: '' }}
      />,
    );
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(1);
  });

  it('renders the react fragment in the default case', () => {
    (state.registry.extensions as any).error = [
      {
        component: StubErrorInfo,
      },
    ];
    const node = mount(<DefaultErrorInfo type="extension" error="foo" />);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.findWhere((n) => n.key() === 'default_error').length).toBe(0);
  });
});
