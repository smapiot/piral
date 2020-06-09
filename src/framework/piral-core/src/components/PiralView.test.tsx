import * as React from 'react';
import * as hooks from '../hooks';
import * as routes from './PiralRoutes';
import { mount } from 'enzyme';
import { PiralView } from './PiralView';

const StubDashboard: React.FC = () => <div />;
StubDashboard.displayName = 'StubDashboard';

const StubErrorInfo: React.FC = () => <div />;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubLoader: React.FC = () => <div />;
StubLoader.displayName = 'StubLoader';

const StubRouter: React.FC = ({ children }) => <div>{children}</div>;
StubRouter.displayName = 'StubRouter';

const StubLayout: React.FC = ({ children }) => <div>{children}</div>;
StubLayout.displayName = 'StubLayout';

jest.mock('../hooks');
jest.mock('./PiralRoutes');

const state = {
  app: {
    error: undefined,
    loading: true,
  },
  components: {
    ErrorInfo: StubErrorInfo,
    LoadingIndicator: StubLoader,
    Router: StubRouter,
    Layout: StubLayout,
  },
  registry: {
    pages: {},
    extensions: {},
  },
  routes: {},
  provider: undefined,
};

(hooks as any).useGlobalState = (select: any) => select(state);

(routes as any).PiralRoutes = ({}) => <StubDashboard />;

describe('Portal Module', () => {
  it('renders the dashboard / content in layout if loaded without error', () => {
    state.app.loading = false;
    state.app.error = undefined;
    const node = mount(<PiralView />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(1);
  });

  it('just renders the loader if not loaded yet', () => {
    state.app.loading = true;
    state.app.error = undefined;
    const node = mount(<PiralView />);
    expect(node.find(StubLoader).length).toBe(1);
    expect(node.find(StubErrorInfo).length).toBe(0);
    expect(node.find(StubDashboard).length).toBe(0);
  });

  it('renders the error outside layout if errored when loading', () => {
    state.app.loading = false;
    state.app.error = new Error('Test');
    const node = mount(<PiralView />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.find(StubErrorInfo).prop('type')).toBe('loading');
    expect(node.find(StubDashboard).length).toBe(0);
  });

  it('renders the not found error in layout', () => {
    state.app.loading = false;
    state.app.error = undefined;
    (routes as any).PiralRoutes = ({ NotFound }) => <NotFound />;
    const node = mount(<PiralView />);
    expect(node.find(StubLoader).length).toBe(0);
    expect(node.find(StubErrorInfo).length).toBe(1);
    expect(node.find(StubErrorInfo).prop('type')).toBe('not_found');
    expect(node.find(StubDashboard).length).toBe(0);
  });
});
