import * as React from 'react';
import * as hooks from '../hooks';
import { mount } from 'enzyme';
import { withApi } from './withApi';

jest.mock('../hooks');

(hooks as any).useGlobalState = (select: any) =>
  select({
    app: {
      components: {
        ErrorInfo: StubErrorInfo,
      },
    },
  });

const StubErrorInfo: React.SFC = props => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubComponent: React.SFC<{ shouldCrash?: boolean }> = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('I should crash!');
  }
  return <div />;
};
StubComponent.displayName = 'StubComponent';

describe('withApi Module', () => {
  it('wraps a component and forwards the API as portal', () => {
    const api: any = {};
    const Component = withApi(StubComponent, api);
    const node = mount(<Component />);
    expect(
      node
        .find(StubComponent)
        .first()
        .prop('portal'),
    ).toBe(api);
  });

  it('is protected against a component crash', () => {
    console.error = jest.fn();
    const api: any = {
      trackError: jest.fn(),
    };
    const Component = withApi(StubComponent, api);
    const node = mount(<Component shouldCrash />);
    expect(
      node
        .find(StubErrorInfo)
        .first()
        .prop('type'),
    ).toBe('feed');
  });

  it('reports to trackError when an error is hit', () => {
    console.error = jest.fn();
    const api: any = {
      trackError: jest.fn(),
    };
    const Component = withApi(StubComponent, api);
    const node = mount(<Component shouldCrash />);
    expect(api.trackError).toHaveBeenCalled();
  });
});
