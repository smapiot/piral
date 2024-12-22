/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import * as hooks from '../hooks';
import * as routes from './PiralRoutes';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { PiralView } from './PiralView';

const StubDashboard: React.FC<any> = () => <div role="dashboard" />;
StubDashboard.displayName = 'StubDashboard';

const StubErrorInfo: React.FC<any> = ({ type }) => <div role="error">{type}</div>;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubLoader: React.FC<any> = () => <div role="loader" />;
StubLoader.displayName = 'StubLoader';

const StubRouter: React.FC<any> = ({ children }) => <div role="router">{children}</div>;
StubRouter.displayName = 'StubRouter';

const StubLayout: React.FC<any> = ({ children }) => <div role="layout">{children}</div>;
StubLayout.displayName = 'StubLayout';

vitest.mock('../hooks');
vitest.mock('./PiralRoutes');

const state = {
  app: {
    error: undefined as any,
    loading: true,
  },
  components: {
    ErrorInfo: StubErrorInfo,
    LoadingIndicator: StubLoader,
    Router: StubRouter,
    Layout: StubLayout,
  },
  portals: {},
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
  afterEach(() => {
    cleanup();
  });

  it('renders the dashboard / content in layout if loaded without error', () => {
    state.app.loading = false;
    state.app.error = undefined;
    const node = render(<PiralView />);
    expect(node.queryAllByRole('loader').length).toBe(0);
    expect(node.queryAllByRole('error').length).toBe(0);
    expect(node.queryAllByRole('dashboard').length).toBe(1);
  });

  it('just renders the loader if not loaded yet', () => {
    state.app.loading = true;
    state.app.error = undefined;
    const node = render(<PiralView />);
    expect(node.queryAllByRole('loader').length).toBe(1);
    expect(node.queryAllByRole('error').length).toBe(0);
    expect(node.queryAllByRole('dashboard').length).toBe(0);
  });

  it('renders the error outside layout if errored when loading', () => {
    state.app.loading = false;
    state.app.error = new Error('Test');
    const node = render(<PiralView />);
    expect(node.queryAllByRole('loader').length).toBe(0);
    expect(node.queryAllByRole('error').length).toBe(1);
    expect(node.getByRole('error').textContent).toBe('loading');
    expect(node.queryAllByRole('dashboard').length).toBe(0);
  });

  it('renders the not found error in layout', () => {
    state.app.loading = false;
    state.app.error = undefined;
    (routes as any).PiralRoutes = ({ NotFound }) => <NotFound />;
    const node = render(<PiralView />);
    expect(node.queryAllByRole('loader').length).toBe(0);
    expect(node.queryAllByRole('error').length).toBe(1);
    expect(node.getByRole('error').textContent).toBe('not_found');
    expect(node.queryAllByRole('dashboard').length).toBe(0);
  });
});
