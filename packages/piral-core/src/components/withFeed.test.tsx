import * as React from 'react';
import * as hooks from '../hooks';
import { mount } from 'enzyme';
import { withFeed } from './withFeed';

jest.mock('../hooks');

(React as any).useEffect = jest.fn(fn => fn());

(hooks as any).useGlobalState = (select: any) =>
  select({
    app: {
      components: {
        ErrorInfo: StubErrorInfo,
        Loader: StubLoader,
      },
    },
    feeds: {
      fresh: {
        loaded: false,
        loading: false,
        error: undefined,
        data: undefined,
      },
      foo: {
        loaded: true,
        loading: false,
        error: undefined,
        data: [1, 2, 3],
      },
      bar: {
        loaded: false,
        loading: true,
        error: undefined,
        data: undefined,
      },
      errored: {
        loaded: true,
        loading: false,
        error: 'my-error',
        data: undefined,
      },
    },
  });

const actions = {
  loadFeed: jest.fn(),
};

(hooks as any).useAction = () => actions.loadFeed;

const StubLoader: React.SFC = props => <div />;
StubLoader.displayName = 'StubLoader';

const StubErrorInfo: React.SFC = props => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubComponent: React.SFC<{ data: any }> = props => <div />;
StubComponent.displayName = 'StubComponent';

describe('withFeed Module', () => {
  it('shows loading without invoking action if already loading', () => {
    const options: any = { id: 'bar' };
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(actions.loadFeed).not.toHaveBeenCalled();
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubComponent).length).toBe(0);
  });

  it('shows the component if loaded', () => {
    const options: any = { id: 'foo' };
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(
      node
        .find(StubComponent)
        .first()
        .prop('data'),
    ).toEqual([1, 2, 3]);
  });

  it('shows the error if the feed errored', () => {
    const options: any = { id: 'errored' };
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubComponent).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(
      node
        .find(StubErrorInfo)
        .first()
        .prop('type'),
    ).toBe('feed');
    expect(
      node
        .find(StubErrorInfo)
        .first()
        .prop('error'),
    ).toBe('my-error');
  });

  it('calls the load inside useEffect', () => {
    const options: any = { id: 'fresh' };
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(actions.loadFeed).toHaveBeenCalledWith(options);
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubComponent).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(0);
  });
});
