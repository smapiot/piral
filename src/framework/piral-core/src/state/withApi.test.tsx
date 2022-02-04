import * as React from 'react';
import * as hooks from '../hooks';
import { mount } from 'enzyme';
import { Atom } from '@dbeining/react-atom';
import { withApi } from './withApi';
import { StateContext } from '../state';

function createMockContainer() {
  const state = Atom.of({
    portals: {},
  });
  return {
    context: {
      converters: {},
      readState(cb) {
        return cb({
          registry: {
            wrappers: {},
          },
        });
      },
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      destroyPortal: (id) => {},
    } as any,
  };
}

jest.mock('../hooks');

(hooks as any).useGlobalStateContext = () => ({
  state: {},
});

(hooks as any).useGlobalState = (select: any) =>
  select({
    components: {
      ErrorInfo: StubErrorInfo,
    },
  });

(hooks as any).useActions = () => ({
  destroyPortal: jest.fn(),
});

const StubErrorInfo: React.FC = (props) => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubComponent: React.FC<{ shouldCrash?: boolean }> = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('I should crash!');
  }
  return <div />;
};
StubComponent.displayName = 'StubComponent';

describe('withApi Module', () => {
  it('wraps a component and forwards the API as piral', () => {
    const api: any = {
      meta: {
        name: 'foo',
      },
    };
    const { context } = createMockContainer();
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    const node = mount(<Component />);
    expect(node.find(StubComponent).first().prop('piral')).toBe(api);
  });

  it('is protected against a component crash', () => {
    console.error = jest.fn();
    const api: any = {
      meta: {
        name: 'foo',
      },
    };
    const { context } = createMockContainer();
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    const node = mount(<Component shouldCrash />);
    expect(node.find(StubErrorInfo).first().prop('type')).toBe('feed');
  });

  it('reports to console.error when an error is hit', () => {
    console.error = jest.fn();
    const api: any = {
      meta: {
        name: 'my pilet',
      },
    };
    const { context } = createMockContainer();
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    mount(<Component shouldCrash />);
    expect(console.error).toHaveBeenCalled();
  });

  it('Wraps component of type object', () => {
    const api: any = {
      meta: {
        name: 'foo',
      },
    };
    const { context } = createMockContainer();
    context.converters = {
      html: (component) => {
        return component.component;
      },
    };
    const Component = withApi(context, { type: 'html', component: { mount: () => {} } }, api, 'unknown');

    const node = mount(
      <StateContext.Provider value={context}>
        <Component />
      </StateContext.Provider>,
    );

    expect(node.children.length).toBe(1);
  });

  it('Wraps component which is object == null.', () => {
    const api: any = {
      meta: {
        name: 'foo',
      },
    };
    const { context } = createMockContainer();
    context.converters = {
      html: (component) => {
        return component.component;
      },
    };
    const Component = withApi(context, null, api, 'unknown');

    const node = mount(
      <StateContext.Provider value={context}>
        <Component />
      </StateContext.Provider>,
    );

    expect(Component.displayName).toBeUndefined();
  });
});
