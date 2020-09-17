import * as React from 'react';
import * as piralCore from 'piral-core';
import * as useFeed from './useFeed';
import { mount } from 'enzyme';
import { withFeed } from './withFeed';

jest.mock('piral-core');

const StubLoader: React.FC = () => <div />;
StubLoader.displayName = 'StubLoader';

const StubErrorInfo: React.FC = () => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubComponent: React.FC<{ data: any }> = () => <div />;
StubComponent.displayName = 'StubComponent';

(piralCore as any).PiralLoadingIndicator = StubLoader;
(piralCore as any).PiralError = StubErrorInfo;

describe('withFeed Module', () => {
  it('shows loading without invoking action if already loading', () => {
    const options: any = { id: 'bar' };
    (useFeed as any).useFeed = () => [false, undefined, undefined];
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubComponent).length).toBe(0);
  });

  it('shows the component if loaded', () => {
    const options: any = { id: 'foo' };
    (useFeed as any).useFeed = () => [true, [1, 2, 3], undefined];
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubComponent).first().prop('data')).toEqual([1, 2, 3]);
  });

  it('shows the error if the feed errored', () => {
    const options: any = { id: 'errored' };
    (useFeed as any).useFeed = () => [true, undefined, 'my-error'];
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubComponent).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.find(StubErrorInfo).first().prop('type')).toBe('feed');
    expect(node.find(StubErrorInfo).first().prop('error')).toBe('my-error');
  });

  it('calls the load inside useEffect', () => {
    const options: any = { id: 'fresh' };
    (useFeed as any).useFeed = () => [false, undefined, undefined];
    const Component: any = withFeed(StubComponent, options);
    const node = mount(<Component />);
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubComponent).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(0);
  });
});
